import Layout from "@/components/Layout"
import { usePlant } from "@/hooks/usePlants"
import { useParams, Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Calendar, User, Clipboard, Leaf, Phone, Tag, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { PLANT_STATUS_LABEL, PLANT_STATUS_COLOR, PLANT_GRADE_COLOR } from "@/types/api"

function formatPrice(price: number | null | undefined) {
  if (!price) return null
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)
}

export default function PlantDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: plant, isLoading, isError } = usePlant(id ?? "")

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 max-w-4xl">
          <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-xl bg-muted animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (isError || !plant) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-4xl mb-4">🌿</p>
          <p className="text-muted-foreground">Tanaman tidak ditemukan.</p>
          <Link to="/catalog"><Button variant="outline" className="mt-4">Kembali ke Katalog</Button></Link>
        </div>
      </Layout>
    )
  }

  const imageUrl = plant.images?.[0]
  const priceStr = formatPrice(plant.price)
  const statusLabel = PLANT_STATUS_LABEL[plant.status ?? "available"]
  const statusColor = PLANT_STATUS_COLOR[plant.status ?? "available"]

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Gambar */}
          <div className="aspect-square rounded-xl bg-gradient-primary/10 flex items-center justify-center relative overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={plant.common_name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl opacity-30">🌿</div>
            )}
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-mono">
              {plant.barcode}
            </Badge>
          </div>

          {/* Info */}
          <div>
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{plant.category}</Badge>
              <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", statusColor)}>
                {statusLabel}
              </span>
              {plant.grade && (
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded border", PLANT_GRADE_COLOR[plant.grade] ?? "bg-muted")}>
                  Grade {plant.grade}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground">{plant.common_name}</h1>
            <p className="text-lg italic text-muted-foreground mt-1">{plant.latin_name}</p>

            {/* Harga */}
            {priceStr && (
              <div className="mt-4 inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-xl font-bold text-primary">{priceStr}</span>
              </div>
            )}

            <p className="mt-5 text-foreground/80 leading-relaxed">{plant.description}</p>

            {/* Detail rows */}
            <div className="mt-6 space-y-3">
              {plant.care_guide && <InfoRow icon={Leaf} label="Perawatan" value={plant.care_guide} />}
              {plant.location && <InfoRow icon={MapPin} label="Lokasi" value={plant.location} />}
              {plant.supplier && <InfoRow icon={User} label="Supplier" value={plant.supplier} />}
              {plant.supplier_contact && (
                <InfoRow icon={Phone} label="Kontak Supplier" value={plant.supplier_contact} isPhone />
              )}
              <InfoRow icon={Calendar} label="Ditambahkan" value={new Date(plant.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow icon={RefreshCw} label="Terakhir Diperbarui" value={new Date(plant.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow icon={Clipboard} label="Barcode" value={plant.barcode} isMono />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function InfoRow({
  icon: Icon, label, value, isMono, isPhone,
}: {
  icon: any; label: string; value: string; isMono?: boolean; isPhone?: boolean
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-muted-foreground text-xs">{label}</p>
        {isPhone ? (
          <a
            href={`https://wa.me/62${value.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {value}
          </a>
        ) : (
          <p className={cn("text-foreground", isMono && "font-mono text-xs")}>{value}</p>
        )}
      </div>
    </div>
  )
}
