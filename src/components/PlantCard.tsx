import { Plant, PLANT_STATUS_LABEL, PLANT_STATUS_COLOR, PLANT_GRADE_COLOR } from "@/types/api"
import { Link } from "react-router-dom"
import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PlantCardProps {
  plant: Plant
}

function formatPrice(price: number | null) {
  if (!price) return null
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price)
}

export default function PlantCard({ plant }: PlantCardProps) {
  const imageUrl = plant.images?.[0]
  const priceStr = formatPrice(plant.price)

  return (
    <Link
      to={`/plant/${plant.id}`}
      className="group block rounded-xl border border-border/50 bg-card shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in"
    >
      {/* Gambar */}
      <div className="aspect-[4/3] bg-gradient-primary/10 flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={plant.common_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform duration-500">🌿</div>
        )}
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px] font-mono">
          {plant.barcode}
        </Badge>
        {/* Status badge */}
        <span className={cn(
          "absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full border",
          PLANT_STATUS_COLOR[plant.status ?? "available"]
        )}>
          {PLANT_STATUS_LABEL[plant.status ?? "available"]}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {plant.common_name}
            </h3>
            <p className="text-xs italic text-muted-foreground mt-0.5 truncate">{plant.latin_name}</p>
          </div>
          {plant.grade && (
            <span className={cn(
              "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border",
              PLANT_GRADE_COLOR[plant.grade] ?? "bg-muted text-muted-foreground"
            )}>
              {plant.grade}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[10px]">{plant.category}</Badge>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {plant.location && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {plant.location.split(",")[0]}
            </span>
          )}
          {priceStr && (
            <span className="text-xs font-semibold text-primary shrink-0 ml-auto">
              {priceStr}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
