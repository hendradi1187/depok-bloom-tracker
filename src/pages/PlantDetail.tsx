import Layout from "@/components/Layout";
import { MOCK_PLANTS } from "@/data/mockData";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, User, Clipboard, Leaf } from "lucide-react";

export default function PlantDetail() {
  const { id } = useParams();
  const plant = MOCK_PLANTS.find((p) => p.id === id);

  if (!plant) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-4xl mb-4">🌿</p>
          <p className="text-muted-foreground">Tanaman tidak ditemukan.</p>
          <Link to="/catalog">
            <Button variant="outline" className="mt-4">Kembali ke Katalog</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square rounded-xl bg-gradient-primary/10 flex items-center justify-center relative">
            <div className="text-8xl opacity-30">🌿</div>
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-mono">
              {plant.barcode}
            </Badge>
          </div>

          {/* Info */}
          <div>
            <Badge variant="secondary" className="mb-3">{plant.category}</Badge>
            <h1 className="font-display text-3xl font-bold text-foreground">{plant.common_name}</h1>
            <p className="text-lg italic text-muted-foreground mt-1">{plant.latin_name}</p>

            <p className="mt-6 text-foreground/80 leading-relaxed">{plant.description}</p>

            <div className="mt-6 space-y-3">
              <InfoRow icon={Leaf} label="Perawatan" value={plant.care_guide} />
              <InfoRow icon={MapPin} label="Lokasi" value={plant.location} />
              <InfoRow icon={User} label="Supplier" value={plant.supplier} />
              <InfoRow icon={Calendar} label="Ditambahkan" value={plant.created_at} />
              <InfoRow icon={Clipboard} label="Barcode" value={plant.barcode} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground">{value}</p>
      </div>
    </div>
  );
}
