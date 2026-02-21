import Layout from "@/components/Layout";
import PlantCard from "@/components/PlantCard";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { usePlants } from "@/hooks/usePlants";
import { useCategories } from "@/hooks/useCategories";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );

  const { data: categoriesData } = useCategories();
  const { data: plantsData, isLoading } = usePlants({
    search: search || undefined,
    category: selectedCategory || undefined,
    limit: 100,
  });

  const categories = categoriesData ?? [];
  const plants = plantsData?.data ?? [];
  const total = plantsData?.meta.total ?? 0;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Katalog Tanaman</h1>
          <p className="text-muted-foreground mt-1">Telusuri koleksi tanaman hias Kota Depok</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama tanaman, latin, atau barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selectedCategory === cat.name
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">
          {isLoading ? "Memuat..." : `${total} tanaman ditemukan`}
        </p>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card shadow-soft h-56 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}

        {!isLoading && plants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🌿</p>
            <p className="text-muted-foreground">Tidak ada tanaman yang cocok dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
