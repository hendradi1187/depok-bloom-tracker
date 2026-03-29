import { useState } from "react"
import Layout from "@/components/Layout"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import StatsCard from "@/components/StatsCard"
import AdminNav from "@/components/admin/AdminNav"
import PlantFormSheet from "@/components/admin/PlantFormSheet"
import DeletePlantDialog from "@/components/admin/DeletePlantDialog"
import {
  Leaf, ScanLine, BarChart3, Users, Plus, Search,
  Pencil, Trash2, ChevronLeft, ChevronRight, Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { usePlants } from "@/hooks/usePlants"
import { useStatsSummary } from "@/hooks/useScans"
import { useAuth } from "@/context/AuthContext"
import { Plant } from "@/types/api"

const PAGE_SIZE = 10

export default function AdminDashboard() {
  const { user } = useAuth()

  // State CRUD
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const [deletingPlant, setDeletingPlant] = useState<Plant | null>(null)

  // State tabel
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)

  // Debounce search
  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearTimeout((handleSearchChange as any)._t)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(handleSearchChange as any)._t = setTimeout(() => setDebouncedSearch(val), 400)
  }

  const { data: stats } = useStatsSummary()
  const { data: plantsData, isLoading } = usePlants({
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  })

  const plants = plantsData?.data ?? []
  const meta = plantsData?.meta
  const totalPages = meta?.total_pages ?? 1

  const handleExportCSV = () => {
    if (!plants.length) return
    const headers = ["Barcode", "Nama Umum", "Nama Latin", "Kategori", "Status", "Grade", "Harga", "Lokasi", "Supplier", "Kontak Supplier"]
    const rows = plants.map((p) => [
      p.barcode,
      p.common_name,
      p.latin_name,
      p.category,
      p.status,
      p.grade ?? "",
      p.price ?? "",
      p.location ?? "",
      p.supplier ?? "",
      p.supplier_contact ?? "",
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `flora-depok-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const openCreate = () => {
    setEditingPlant(null)
    setFormOpen(true)
  }

  const openEdit = (plant: Plant) => {
    setEditingPlant(plant)
    setFormOpen(true)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) setEditingPlant(null)
  }

  return (
    <Layout>
      <div className="container py-8">
        <BreadcrumbNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang,{" "}
              <span className="font-medium text-foreground">{user?.name}</span>
              <Badge variant="outline" className="ml-2 text-[10px] font-mono">{user?.role}</Badge>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-primary text-primary-foreground gap-2 shadow-soft"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4" />
              Tambah Tanaman
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5"
              disabled={plants.length === 0}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Total Tanaman"
            value={stats?.total_plants ?? 0}
            icon={Leaf}
            variant="primary"
          />
          <StatsCard
            label="Total Scan"
            value={stats?.total_scans ?? 0}
            icon={ScanLine}
            trend={`+${stats?.scans_today ?? 0} hari ini`}
          />
          <StatsCard
            label="Kategori"
            value={stats?.total_categories ?? 0}
            icon={BarChart3}
            variant="accent"
          />
          <StatsCard
            label="Pengguna"
            value={stats?.total_users ?? 0}
            icon={Users}
            variant="secondary"
          />
        </div>

        <AdminNav />

        {/* Tabel Tanaman */}
        <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
          {/* Toolbar tabel */}
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-semibold text-foreground">Data Tanaman</h2>
              <Badge variant="secondary">{meta?.total ?? 0} tanaman</Badge>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau barcode..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>

          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Barcode</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nama</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Lokasi</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="px-4 py-3"><div className="h-5 w-24 bg-muted animate-pulse rounded" /></td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-36 bg-muted animate-pulse rounded mb-1.5" />
                        <div className="h-3 w-28 bg-muted animate-pulse rounded" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell"><div className="h-5 w-20 bg-muted animate-pulse rounded" /></td>
                      <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
                      <td className="px-4 py-3"><div className="h-7 w-20 bg-muted animate-pulse rounded ml-auto" /></td>
                    </tr>
                  ))
                )}

                {!isLoading && plants.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="text-2xl mb-2">🌿</p>
                      <p className="text-muted-foreground text-sm">
                        {debouncedSearch ? "Tidak ada tanaman yang cocok" : "Belum ada data tanaman"}
                      </p>
                    </td>
                  </tr>
                )}

                {!isLoading && plants.map((plant) => (
                  <tr
                    key={plant.id}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                  >
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
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {plant.location || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(plant)}
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingPlant(plant)}
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Halaman {page} dari {totalPages} · {meta?.total} tanaman
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i
                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={page === pageNum ? "default" : "outline"}
                      className="h-7 w-7 p-0 text-xs"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CRUD dialogs */}
      <PlantFormSheet
        open={formOpen}
        onOpenChange={handleFormClose}
        plant={editingPlant}
      />
      <DeletePlantDialog
        plant={deletingPlant}
        onOpenChange={(open) => !open && setDeletingPlant(null)}
      />
    </Layout>
  )
}
