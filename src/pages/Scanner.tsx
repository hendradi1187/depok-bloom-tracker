import Layout from "@/components/Layout"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, X, ScanLine, AlertCircle, Tag, Phone, ClipboardList } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Plant, PLANT_STATUS_LABEL, PLANT_STATUS_COLOR, PLANT_GRADE_COLOR } from "@/types/api"
import { api } from "@/lib/api"
import { useCreateScan } from "@/hooks/useScans"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

function formatPrice(price: number | null | undefined) {
  if (!price) return null
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)
}

export default function Scanner() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<Plant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [recordingScan, setRecordingScan] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const createScan = useCreateScan()

  // Check if user can record scans (officer or admin only)
  const canRecordScan = user && (user.role === "officer" || user.role === "admin")

  const lookupBarcode = async (code: string) => {
    setLoading(true)
    setError(null)
    try {
      const plant = await api.get<Plant>(`/api/plants/barcode/${encodeURIComponent(code)}`)
      setResult(plant)
      setLoading(false)
    } catch {
      setError(`Barcode "${code}" tidak ditemukan dalam database.`)
      setLoading(false)
    }
  }

  const handleRecordScan = async () => {
    if (!result || !canRecordScan) return
    setRecordingScan(true)
    try {
      await createScan.mutateAsync({ barcode: result.barcode })
      toast({
        title: "Pemindaian Dicatat",
        description: `Pemindaian ${result.common_name} berhasil dicatat.`,
      })
    } catch {
      toast({
        title: "Gagal Mencatat",
        description: "Terjadi kesalahan saat mencatat pemindaian.",
        variant: "destructive",
      })
    } finally {
      setRecordingScan(false)
    }
  }

  const startScanner = async () => {
    setError(null)
    setResult(null)
    setScanning(true)
    try {
      const { Html5Qrcode } = await import("html5-qrcode")
      const scanner = new Html5Qrcode("scanner-container")
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => { stopScanner(); lookupBarcode(decodedText) },
        () => {}
      )
    } catch {
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.")
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); scannerRef.current.clear() } catch { /* abaikan error stop */ }
      scannerRef.current = null
    }
    setScanning(false)
  }

  useEffect(() => { return () => { stopScanner() } }, [])

  const priceStr = formatPrice(result?.price)
  const statusLabel = result ? PLANT_STATUS_LABEL[result.status ?? "available"] : ""
  const statusColor = result ? PLANT_STATUS_COLOR[result.status ?? "available"] : ""

  return (
    <Layout>
      <div className="container py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary mb-4">
            <ScanLine className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Scan Tanaman</h1>
          <p className="text-muted-foreground mt-1">Arahkan kamera ke barcode atau QR code tanaman</p>
        </div>

        {/* Scanner area */}
        {!result && (
          <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
            {scanning ? (
              <div className="relative">
                <div id="scanner-container" ref={containerRef} className="w-full" />
                <Button size="sm" variant="destructive" className="absolute top-3 right-3 z-10" onClick={stopScanner}>
                  <X className="h-4 w-4 mr-1" /> Tutup
                </Button>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center">
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mb-6 bg-primary/5">
                  <Camera className="h-16 w-16 text-primary/40" />
                </div>
                <Button onClick={startScanner} className="bg-gradient-primary text-primary-foreground gap-2 shadow-elevated">
                  <Camera className="h-5 w-5" /> Buka Kamera
                </Button>
              </div>
            )}
            <div className="p-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2 text-center">Atau masukkan kode manual</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="DPK-ORN-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && manualCode.trim() && lookupBarcode(manualCode.trim())}
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" onClick={() => manualCode.trim() && lookupBarcode(manualCode.trim())} disabled={loading}>
                  {loading ? "..." : "Cari"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => { setError(null); setManualCode("") }}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-xl border border-border/50 bg-card shadow-elevated overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="p-6 bg-gradient-primary text-primary-foreground text-center">
              <p className="text-sm font-medium opacity-80">Tanaman Ditemukan!</p>
              <h2 className="font-display text-2xl font-bold mt-1">{result.common_name}</h2>
              <p className="text-sm italic opacity-70">{result.latin_name}</p>
            </div>

            {/* Gambar (jika ada) */}
            {result.images?.[0] && (
              <div className="aspect-video overflow-hidden">
                <img src={result.images[0]} alt={result.common_name} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-5 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{result.category}</Badge>
                <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", statusColor)}>
                  {statusLabel}
                </span>
                {result.grade && (
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded border", PLANT_GRADE_COLOR[result.grade] ?? "bg-muted")}>
                    Grade {result.grade}
                  </span>
                )}
                <Badge className="font-mono ml-auto bg-muted text-muted-foreground">{result.barcode}</Badge>
              </div>

              {/* Harga */}
              {priceStr && (
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="font-bold text-primary text-lg">{priceStr}</span>
                </div>
              )}

              {/* Deskripsi */}
              {result.description && (
                <p className="text-sm text-foreground/80 leading-relaxed">{result.description}</p>
              )}

              {/* Perawatan */}
              {result.care_guide && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">🌿 Perawatan</p>
                  <p className="text-sm text-foreground/80">{result.care_guide}</p>
                </div>
              )}

              {/* Lokasi & Supplier */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {result.location && (
                  <div>
                    <p className="text-muted-foreground font-medium">📍 Lokasi</p>
                    <p className="text-foreground mt-0.5">{result.location}</p>
                  </div>
                )}
                {result.supplier && (
                  <div>
                    <p className="text-muted-foreground font-medium">🏪 Supplier</p>
                    <p className="text-foreground mt-0.5">{result.supplier}</p>
                  </div>
                )}
              </div>

              {/* Kontak Supplier */}
              {result.supplier_contact && (
                <a
                  href={`https://wa.me/62${result.supplier_contact.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg border border-green-500/30 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Hubungi Supplier: {result.supplier_contact}
                </a>
              )}

              {/* Tombol aksi */}
              <div className="space-y-2 pt-1">
                {canRecordScan && (
                  <Button
                    onClick={handleRecordScan}
                    disabled={recordingScan}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    {recordingScan ? "Mencatat..." : "Catat Pemindaian"}
                  </Button>
                )}
                <div className="flex gap-2">
                  <Link to={`/plant/${result.id}`} className="flex-1">
                    <Button className="w-full bg-gradient-primary text-primary-foreground">Detail Lengkap</Button>
                  </Link>
                  <Button variant="outline" onClick={() => { setResult(null); setManualCode("") }}>
                    Scan Lagi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-2">💡 Tips Scanning</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Pastikan barcode terlihat jelas dan tidak rusak</li>
            <li>• Gunakan pencahayaan yang cukup</li>
            <li>• Coba kode: <span className="font-mono text-primary">DPK-ORN-001</span> untuk demo</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
