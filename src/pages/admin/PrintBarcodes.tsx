import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import Layout from "@/components/Layout"
import AdminNav from "@/components/admin/AdminNav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Printer, CheckSquare, Square, RotateCcw, Settings2 } from "lucide-react"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { usePlants } from "@/hooks/usePlants"
import { Plant } from "@/types/api"

type LabelSize = "sm" | "md" | "lg"

const LABEL_SIZE_CONFIG: Record<LabelSize, { label: string; width: string; qr: number; textSm: string; textBase: string }> = {
  sm: { label: "Kecil (5×4 cm)",   width: "w-[5cm]",   qr: 72,  textSm: "text-[8px]",  textBase: "text-[9px]" },
  md: { label: "Sedang (7×5.5 cm)", width: "w-[7cm]",   qr: 96,  textSm: "text-[9px]",  textBase: "text-[10px]" },
  lg: { label: "Besar (9×7 cm)",    width: "w-[9cm]",   qr: 128, textSm: "text-[10px]", textBase: "text-[11px]" },
}

interface LabelProps {
  plant: Plant
  size: LabelSize
}

function PlantLabel({ plant, size }: LabelProps) {
  const cfg = LABEL_SIZE_CONFIG[size]
  return (
    <div
      className={`${cfg.width} border border-gray-400 rounded p-2 flex flex-col items-center gap-1.5 bg-white break-inside-avoid`}
      style={{ pageBreakInside: "avoid" }}
    >
      <QRCodeSVG
        value={plant.barcode}
        size={cfg.qr}
        level="M"
        includeMargin={false}
        bgColor="#ffffff"
        fgColor="#000000"
      />
      <div className="w-full text-center space-y-0.5">
        <p className={`${cfg.textBase} font-bold text-gray-900 leading-tight`}>{plant.common_name}</p>
        <p className={`${cfg.textSm} italic text-gray-500 leading-tight`}>{plant.latin_name}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className={`${cfg.textSm} font-mono font-semibold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded`}>
            {plant.barcode}
          </span>
        </div>
        <p className={`${cfg.textSm} text-gray-400`}>{plant.category}</p>
        {plant.location && (
          <p className={`${cfg.textSm} text-gray-400 leading-tight`}>
            📍 {plant.location.split(",")[0]}
          </p>
        )}
      </div>
    </div>
  )
}

export default function PrintBarcodes() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [size, setSize] = useState<LabelSize>("md")
  const printRef = useRef<HTMLDivElement>(null)

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

  const handlePrint = () => {
    if (selectedPlants.length === 0) return
    window.print()
  }

  return (
    <>
      {/* ── PRINT STYLES ── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            padding: 1cm;
            display: flex;
            flex-wrap: wrap;
            gap: 4mm;
            align-content: flex-start;
          }
          @page { margin: 1cm; size: A4 portrait; }
        }
      `}</style>

      <Layout>
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Cetak Label QR</h1>
              <p className="text-muted-foreground mt-1">
                Pilih tanaman, atur ukuran, lalu cetak label untuk ditempel di setiap tanaman
              </p>
            </div>
            <Button
              className="bg-gradient-primary text-primary-foreground gap-2 shadow-soft"
              onClick={handlePrint}
              disabled={selectedPlants.length === 0}
            >
              <Printer className="h-4 w-4" />
              Cetak {selectedPlants.length} Label
            </Button>
          </div>

          <AdminNav />

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-4 rounded-xl border border-border/50 bg-card shadow-soft">
            <div className="flex items-center gap-2 flex-1">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 h-8"
                onClick={toggleAll}
              >
                {allSelected
                  ? <><CheckSquare className="h-3.5 w-3.5 text-primary" /> Hapus Semua</>
                  : <><Square className="h-3.5 w-3.5" /> Pilih Semua</>
                }
              </Button>

              {someSelected && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1.5 h-8 text-muted-foreground"
                  onClick={() => setSelected(new Set())}
                >
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
                <SelectTrigger className="h-8 w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LABEL_SIZE_CONFIG).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pilihan tanaman */}
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
                      : <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                    }
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

          {/* Preview label */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-sm text-foreground">
                Preview Label ({selectedPlants.length})
              </h2>
              <p className="text-xs text-muted-foreground">Tampilan sebelum cetak</p>
            </div>
            <div
              id="print-area"
              ref={printRef}
              className="flex flex-wrap gap-3"
            >
              {selectedPlants.map((plant) => (
                <PlantLabel key={plant.id} plant={plant} size={size} />
              ))}
              {selectedPlants.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 mx-auto">
                  Pilih tanaman di atas untuk melihat preview label
                </p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
