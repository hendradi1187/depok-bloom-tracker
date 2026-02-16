import { Plant } from "@/data/mockData";
import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <Link
      to={`/plant/${plant.id}`}
      className="group block rounded-xl border border-border/50 bg-card shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden animate-fade-in"
    >
      <div className="aspect-[4/3] bg-gradient-primary/10 flex items-center justify-center relative overflow-hidden">
        <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform duration-500">🌿</div>
        <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-[10px]">
          {plant.barcode}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
          {plant.common_name}
        </h3>
        <p className="text-xs italic text-muted-foreground mt-0.5">{plant.latin_name}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-[10px]">{plant.category}</Badge>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {plant.location.split(",")[0]}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {plant.created_at}
          </span>
        </div>
      </div>
    </Link>
  );
}
