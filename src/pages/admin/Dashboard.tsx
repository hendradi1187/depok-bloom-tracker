import Layout from "@/components/Layout";
import StatsCard from "@/components/StatsCard";
import { MOCK_PLANTS, MOCK_SCANS, MOCK_CATEGORIES } from "@/data/mockData";
import { Leaf, ScanLine, MapPin, Users, Plus, Download, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Kelola data tanaman hias Kota Depok</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-primary text-primary-foreground gap-2 shadow-soft">
              <Plus className="h-4 w-4" /> Tambah Tanaman
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Tanaman" value={MOCK_PLANTS.length} icon={Leaf} variant="primary" />
          <StatsCard label="Total Scan" value={MOCK_SCANS.length} icon={ScanLine} />
          <StatsCard label="Kategori" value={MOCK_CATEGORIES.length} icon={BarChart3} variant="accent" />
          <StatsCard label="Pengguna" value={3} icon={Users} variant="secondary" />
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Plus, label: "Tambah Tanaman Baru", desc: "Input data tanaman dan barcode" },
            { icon: BarChart3, label: "Lihat Statistik", desc: "Analisis data scan dan lokasi" },
            { icon: Settings, label: "Pengaturan", desc: "Kelola pengguna dan peran" },
          ].map((action, i) => (
            <button
              key={i}
              className="rounded-xl border border-border/50 bg-card p-5 text-left shadow-soft hover:shadow-elevated hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all">
                <action.icon className="h-5 w-5" />
              </div>
              <p className="font-display font-semibold text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* Plant list table */}
        <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h2 className="font-display font-semibold text-foreground">Data Tanaman</h2>
            <Badge variant="secondary">{MOCK_PLANTS.length} tanaman</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Barcode</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Lokasi</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PLANTS.map((plant) => (
                  <tr key={plant.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs">{plant.barcode}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{plant.common_name}</p>
                      <p className="text-xs italic text-muted-foreground">{plant.latin_name}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="secondary" className="text-xs">{plant.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{plant.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs">Edit</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive">Hapus</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
