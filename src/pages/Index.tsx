import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import PlantCard from "@/components/PlantCard";
import { Leaf, ScanLine, MapPin, Users, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-garden.jpg";
import { usePlants } from "@/hooks/usePlants";
import { useCategories } from "@/hooks/useCategories";
import { useScans, useStatsSummary } from "@/hooks/useScans";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user } = useAuth();
  const { data: statsData } = useStatsSummary();
  const { data: categoriesData } = useCategories();
  const { data: plantsData } = usePlants({ limit: 3 });
  // Only fetch scans if user is logged in (officer/admin)
  const { data: scansData } = useScans({ enabled: !!user && (user.role === 'officer' || user.role === 'admin') });

  const stats = statsData;
  const categories = categoriesData ?? [];
  const featuredPlants = plantsData?.data ?? [];
  const recentScans = scansData?.data ?? [];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Taman Kota Depok" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero/85" />
        </div>
        <div className="relative container py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-secondary text-secondary-foreground font-semibold shadow-gold">
              Pemerintah Kota Depok
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-primary-foreground">
              Katalog Tanaman{" "}
              <span className="text-secondary">Hias Digital</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 leading-relaxed max-w-lg">
              Sistem pendataan dan monitoring tanaman hias Kota Depok berbasis barcode.
              Terintegrasi untuk petugas lapangan dan pimpinan daerah.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/scanner">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold font-semibold gap-2">
                  <ScanLine className="h-5 w-5" />
                  Scan Tanaman
                </Button>
              </Link>
              <Link to="/catalog">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                  <Search className="h-5 w-5" />
                  Jelajahi Katalog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Tanaman" value={stats?.total_plants ?? 0} icon={Leaf} trend={`+${stats?.scans_this_week ?? 0} scan minggu ini`} variant="primary" />
          <StatsCard label="Total Scan" value={stats?.total_scans ?? 0} icon={ScanLine} trend={`+${stats?.scans_today ?? 0} hari ini`} />
          <StatsCard label="Kategori" value={stats?.total_categories ?? 0} icon={MapPin} variant="accent" />
          <StatsCard label="Pengguna Aktif" value={stats?.total_users ?? 0} icon={Users} variant="secondary" />
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Kategori Tanaman</h2>
            <p className="text-sm text-muted-foreground mt-1">Kelompok tanaman hias berdasarkan jenis</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.name}`}
              className="group rounded-xl border border-border/50 bg-card p-4 text-center shadow-soft hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-3xl mb-2">🌱</div>
              <p className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{cat.count} tanaman</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Plants */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Tanaman Unggulan</h2>
            <p className="text-sm text-muted-foreground mt-1">Koleksi terbaru tanaman hias Kota Depok</p>
          </div>
          <Link to="/catalog">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
              Lihat Semua <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredPlants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </section>

      {/* Recent Scans - Only show for logged in users */}
      {user && (user.role === 'officer' || user.role === 'admin') && (
        <section className="container pb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Scan Terbaru</h2>
          <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/50">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Tanaman</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Lokasi</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm">
                        Belum ada data scan
                      </td>
                    </tr>
                  )}
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {scan.plant?.common_name ?? '-'}
                        <span className="block text-xs italic text-muted-foreground">{scan.plant?.latin_name}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{scan.location}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(scan.scanned_at).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
