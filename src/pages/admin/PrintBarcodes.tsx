import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import Layout from "@/components/Layout"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, CheckSquare, Square, RotateCcw, Settings2 } from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { usePlants } from "@/hooks/usePlants"
import { Plant } from "@/types/api"
import depokLogo from "@/assets/depok-logo.png"

// ── Warna brand (harus eksplisit untuk print) ──────────────────
const C = {
  green:      "#1e6b42",
  greenDark:  "#154d30",
  greenLight: "#2d8a68",
  greenPale:  "#e8f5ee",
  gold:       "#c8951a",
  goldLight:  "#fdf3dc",
  white:      "#ffffff",
  grey50:     "#f9fafb",
  grey100:    "#f3f4f6",
  grey200:    "#e5e7eb",
  grey400:    "#9ca3af",
  grey600:    "#4b5563",
  grey900:    "#111827",
}

type LabelSize = "sm" | "md" | "lg"

interface SizeCfg {
  label: string
  cardW: number   // px (screen preview & print via transform)
  qr: number
  fontTitle: number
  fontSub: number
  fontXs: number
  padding: number
}

const SIZE: Record<LabelSize, SizeCfg> = {
  sm: { label: "Kecil (5.5 × 8 cm)",  cardW: 208, qr: 80,  fontTitle: 11, fontSub: 9,  fontXs: 8,  padding: 10 },
  md: { label: "Sedang (7 × 10 cm)",  cardW: 265, qr: 104, fontTitle: 13, fontSub: 10, fontXs: 9,  padding: 13 },
  lg: { label: "Besar (9 × 13 cm)",   cardW: 340, qr: 136, fontTitle: 16, fontSub: 12, fontXs: 10, padding: 16 },
}

// Konversi px ke cm untuk print (96dpi → 1cm = 37.8px)
const px2cm = (px: number) => `${(px / 37.8).toFixed(2)}cm`

interface LabelProps { plant: Plant; cfg: SizeCfg; logoSrc: string }

function PlantLabel({ plant, cfg, logoSrc }: LabelProps) {
  const { cardW, qr, fontTitle, fontSub, fontXs, padding: p } = cfg
  const headerH = Math.round(cardW * 0.18)
  const footerH = Math.round(cardW * 0.12)

  return (
    <div
      className="plant-label"
      style={{
        width: cardW,
        background: C.white,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        pageBreakInside: "avoid",
        breakInside: "avoid",
        flexShrink: 0,
      }}
    >
      {/* ── Header hijau ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.greenDark} 0%, ${C.green} 55%, ${C.greenLight} 100%)`,
        height: headerH,
        display: "flex",
        alignItems: "center",
        padding: `0 ${p}px`,
        gap: 8,
      }}>
        <div style={{
          height: headerH * 0.72,
          aspectRatio: "650/841",
          background: "white",
          borderRadius: 4,
          padding: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img
            src={logoSrc || depokLogo}
            alt="Logo Kota Depok"
            style={{
              height: "100%",
              width: "auto",
              objectFit: "contain"
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: fontSub + 1, letterSpacing: "0.04em", lineHeight: 1.15 }}>
            FLORA DEPOK
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: fontXs - 1, letterSpacing: "0.02em", lineHeight: 1.2 }}>
            Katalog Tanaman Hias
          </div>
        </div>
        {/* Accent dot */}
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, opacity: 0.9 }} />
      </div>

      {/* ── Body ── */}
      <div style={{ padding: `${p}px ${p}px ${p * 0.6}px`, display: "flex", flexDirection: "column", alignItems: "center", gap: p * 0.7, background: C.white }}>

        {/* QR Code dengan border dekoratif */}
        <div style={{
          background: C.white,
          border: `2px solid ${C.greenPale}`,
          borderRadius: 8,
          padding: 6,
          display: "inline-flex",
          position: "relative",
        }}>
          {/* Sudut dekoratif */}
          {[
            { top: -1, left: -1, borderTop: `3px solid ${C.green}`, borderLeft: `3px solid ${C.green}` },
            { top: -1, right: -1, borderTop: `3px solid ${C.green}`, borderRight: `3px solid ${C.green}` },
            { bottom: -1, left: -1, borderBottom: `3px solid ${C.green}`, borderLeft: `3px solid ${C.green}` },
            { bottom: -1, right: -1, borderBottom: `3px solid ${C.green}`, borderRight: `3px solid ${C.green}` },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: 10, height: 10, borderRadius: 2, ...style }} />
          ))}
          <QRCodeSVG
            value={`${window.location.origin}/plant/${plant.id}`}
            size={qr}
            level="M"
            bgColor={C.white}
            fgColor={C.greenDark}
            includeMargin={false}
          />
        </div>

        {/* Nama tanaman */}
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: fontTitle, fontWeight: 700, color: C.grey900, lineHeight: 1.25, marginBottom: 3 }}>
            {plant.common_name}
          </div>
          <div style={{ fontSize: fontSub, fontStyle: "italic", color: C.grey400, lineHeight: 1.2 }}>
            {plant.latin_name}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "80%", height: 1, background: `linear-gradient(90deg, transparent, ${C.green}40, transparent)` }} />

        {/* Info badges */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>
          {/* Kategori */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: C.greenPale, borderRadius: 20,
            padding: `2px ${p * 0.6}px`,
            border: `1px solid ${C.green}30`,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: fontXs, fontWeight: 600, color: C.green, letterSpacing: "0.03em" }}>
              {plant.category}
            </span>
          </div>

          {/* Lokasi */}
          {plant.location && (
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: fontXs - 1, color: C.grey400 }}>📍</span>
              <span style={{ fontSize: fontXs, color: C.grey600 }}>
                {plant.location.split(",")[0]}
              </span>
            </div>
          )}

          {/* Grade & Harga (jika ada) */}
          {(plant.grade || plant.price) && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {plant.grade && (
                <div style={{
                  background: C.goldLight, border: `1px solid ${C.gold}60`,
                  borderRadius: 4, padding: `1px ${p * 0.4}px`,
                }}>
                  <span style={{ fontSize: fontXs, fontWeight: 700, color: C.gold }}>
                    Grade {plant.grade}
                  </span>
                </div>
              )}
              {plant.price && (
                <span style={{ fontSize: fontXs, fontWeight: 600, color: C.green }}>
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(plant.price)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: C.greenDark,
        height: footerH,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${p}px`,
      }}>
        <span style={{ fontSize: fontXs, fontWeight: 700, fontFamily: "monospace", color: C.white, letterSpacing: "0.06em" }}>
          {plant.barcode}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold }} />
          <span style={{ fontSize: fontXs - 1, color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em" }}>
            flora.depok.id
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Halaman utama ─────────────────────────────────────────────
export default function PrintBarcodes() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [size, setSize] = useState<LabelSize>("md")
  const [whiteLogoDataUrl, setWhiteLogoDataUrl] = useState<string>("")

  // Konversi logo menjadi putih untuk print (tanpa CSS filter)
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Gambar logo original
          ctx.drawImage(img, 0, 0)

          // Ambil pixel data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data

          // Ubah semua pixel non-transparan menjadi putih
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3]
            if (alpha > 10) { // threshold untuk ignore pixel semi-transparan
              // Pixel tidak transparan -> jadikan putih solid
              data[i] = 255     // R
              data[i + 1] = 255 // G
              data[i + 2] = 255 // B
              data[i + 3] = 255 // A (fully opaque)
            }
          }

          // Tulis kembali ke canvas
          ctx.putImageData(imageData, 0, 0)

          // Convert ke base64
          const dataUrl = canvas.toDataURL("image/png")
          console.log("White logo created, length:", dataUrl.length)
          setWhiteLogoDataUrl(dataUrl)
        }
      } catch (err) {
        console.error("Failed to convert logo:", err)
      }
    }
    img.onerror = (err) => {
      console.error("Failed to load logo:", err)
    }
    img.src = depokLogo
  }, [])

  // Inject print + screen CSS langsung ke <head> agar tidak bentrok Tailwind
  useEffect(() => {
    const el = document.createElement("style")
    el.id = "print-barcode-style"
    el.textContent = `
      @media screen {
        #print-area { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; }
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          visibility: hidden !important;
        }
        #print-area, #print-area * {
          visibility: visible !important;
        }
        #print-area {
          position: fixed !important;
          top: 0 !important; left: 0 !important; right: 0 !important;
          padding: 0.8cm !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 5mm !important;
          align-content: flex-start !important;
          background: white !important;
        }
        .plant-label { box-shadow: none !important; }
        @page { margin: 0; size: A4 portrait; }
      }
    `
    document.head.appendChild(el)
    return () => { document.getElementById("print-barcode-style")?.remove() }
  }, [])

  const { data: plantsData, isLoading } = usePlants({ limit: 500 })
  const plants = plantsData?.data ?? []

  const allSelected = plants.length > 0 && selected.size === plants.length
  const someSelected = selected.size > 0

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(plants.map((p) => p.id)))
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedPlants: Plant[] = someSelected
    ? plants.filter((p) => selected.has(p.id))
    : plants

  const cfg = SIZE[size]

  return (
    <Layout>
        <div className="container py-8">
          <BreadcrumbNav />

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Cetak Label QR</h1>
              <p className="text-muted-foreground mt-1">Pilih tanaman, atur ukuran, lalu cetak</p>
            </div>
            <Button
              className="bg-gradient-primary text-primary-foreground gap-2 shadow-soft"
              onClick={() => selectedPlants.length > 0 && window.print()}
              disabled={selectedPlants.length === 0}
            >
              <Printer className="h-4 w-4" />
              Cetak {selectedPlants.length} Label
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-4 rounded-xl border border-border/50 bg-card shadow-soft">
            <div className="flex items-center gap-2 flex-1">
              <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={toggleAll}>
                {allSelected
                  ? <><CheckSquare className="h-3.5 w-3.5 text-primary" /> Hapus Semua</>
                  : <><Square className="h-3.5 w-3.5" /> Pilih Semua</>}
              </Button>
              {someSelected && (
                <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-muted-foreground" onClick={() => setSelected(new Set())}>
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              )}
              <Badge variant="secondary" className="ml-2">
                {someSelected ? `${selected.size} dipilih` : `Semua (${plants.length})`}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Ukuran:</span>
              <Select value={size} onValueChange={(v) => setSize(v as LabelSize)}>
                <SelectTrigger className="h-8 w-48 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(SIZE) as [LabelSize, SizeCfg][]).map(([key, s]) => (
                    <SelectItem key={key} value={key}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Daftar pilih tanaman */}
          <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden mb-8">
            <div className="p-4 border-b border-border/50">
              <h2 className="font-semibold text-sm text-foreground">Pilih Tanaman</h2>
            </div>
            <div className="divide-y divide-border/30">
              {isLoading && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3">
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" />
                </div>
              ))}
              {!isLoading && plants.map((plant) => {
                const isChecked = selected.has(plant.id)
                return (
                  <button
                    key={plant.id}
                    onClick={() => toggle(plant.id)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors text-left"
                  >
                    {isChecked
                      ? <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                      : <Square className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm text-foreground">{plant.common_name}</span>
                      <span className="text-xs italic text-muted-foreground ml-2">{plant.latin_name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="text-[10px]">{plant.category}</Badge>
                      <Badge variant="outline" className="font-mono text-[10px]">{plant.barcode}</Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-foreground">
                Preview Label ({selectedPlants.length})
              </h2>
              <p className="text-xs text-muted-foreground">
                Ukuran kartu: {px2cm(cfg.cardW)} × otomatis · QR: {cfg.qr}px
              </p>
            </div>
            <div id="print-area">
              {selectedPlants.map((plant) => (
                <PlantLabel
                  key={plant.id}
                  plant={plant}
                  cfg={cfg}
                  logoSrc={whiteLogoDataUrl || depokLogo}
                />
              ))}
              {selectedPlants.length === 0 && (
                <p className="text-sm text-muted-foreground py-12 mx-auto text-center w-full">
                  Pilih tanaman di atas untuk melihat preview label
                </p>
              )}
            </div>
          </div>
        </div>
    </Layout>
  )
}
