import { useState } from "react"
import Layout from "@/components/Layout"
import BreadcrumbNav from "@/components/BreadcrumbNav"
import StatsCard from "@/components/StatsCard"
import AdminNav from "@/components/admin/AdminNav"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { BarChart3, ScanLine, Leaf, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStatsSummary, useScanStats, ScanPeriod } from "@/hooks/useScans"
import { useCategories } from "@/hooks/useCategories"

const PERIOD_OPTIONS: { value: ScanPeriod; label: string }[] = [
  { value: "daily", label: "7 Hari" },
  { value: "weekly", label: "28 Hari" },
  { value: "monthly", label: "90 Hari" },
]

const PIE_COLORS = [
  "#16a34a", "#4ade80", "#f43f5e", "#f97316",
  "#84cc16", "#0ea5e9", "#a855f7", "#ec4899",
]

function formatDate(dateStr: string, period: ScanPeriod) {
  const d = new Date(dateStr)
  if (period === "daily") {
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  }
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
}

export default function AdminStats() {
  const [period, setPeriod] = useState<ScanPeriod>("daily")
  const { data: stats } = useStatsSummary()
  const { data: scanStats, isLoading: loadingChart } = useScanStats(period)
  const { data: categories } = useCategories()

  const chartData = (scanStats ?? []).map((s) => ({
    date: formatDate(s.date, period),
    scan: s.count,
  }))

  const totalScansInPeriod = (scanStats ?? []).reduce((sum, s) => sum + s.count, 0)

  const pieData = (categories ?? [])
    .filter((c) => c.count > 0)
    .map((c) => ({ name: c.name, value: c.count }))

  return (
    <Layout>
      <div className="container py-8">
        <BreadcrumbNav />

        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-foreground">Statistik</h1>
          <p className="text-muted-foreground mt-1">Laporan aktivitas dan distribusi tanaman</p>
        </div>

        <AdminNav />

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Tanaman" value={stats?.total_plants ?? 0} icon={Leaf} variant="primary" />
          <StatsCard label="Total Scan" value={stats?.total_scans ?? 0} icon={ScanLine} trend={`+${stats?.scans_today ?? 0} hari ini`} />
          <StatsCard label="Kategori" value={stats?.total_categories ?? 0} icon={BarChart3} variant="accent" />
          <StatsCard label="Pengguna" value={stats?.total_users ?? 0} icon={Users} variant="secondary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scan chart */}
          <div className="lg:col-span-2 rounded-xl border border-border/50 bg-card shadow-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-foreground">Aktivitas Scan</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalScansInPeriod} scan dalam periode ini
                </p>
              </div>
              <div className="flex gap-1">
                {PERIOD_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={period === opt.value ? "default" : "outline"}
                    className="h-7 text-xs px-2.5"
                    onClick={() => setPeriod(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {loadingChart ? (
              <div className="h-52 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-muted-foreground">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-sm">Belum ada data scan</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid hsl(var(--border))",
                      background: "hsl(var(--card))",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    formatter={(value) => [value, "Scan"]}
                  />
                  <Bar dataKey="scan" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category distribution */}
          <div className="rounded-xl border border-border/50 bg-card shadow-soft p-5">
            <h2 className="font-display font-semibold text-foreground mb-1">Distribusi Kategori</h2>
            <p className="text-xs text-muted-foreground mb-4">Jumlah tanaman per kategori</p>

            {pieData.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-muted-foreground">
                <p className="text-3xl mb-2">🌿</p>
                <p className="text-sm">Belum ada data</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                      }}
                      formatter={(value, name) => [value, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-border/50 bg-card shadow-soft p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3">Ringkasan Scan</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scan hari ini</span>
                <span className="font-semibold">{stats?.scans_today ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scan minggu ini</span>
                <span className="font-semibold">{stats?.scans_this_week ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total scan</span>
                <span className="font-semibold">{stats?.total_scans ?? 0}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-card shadow-soft p-5">
            <h3 className="font-semibold text-sm text-foreground mb-3">Ringkasan Katalog</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total tanaman</span>
                <span className="font-semibold">{stats?.total_plants ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total kategori</span>
                <span className="font-semibold">{stats?.total_categories ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pengguna aktif</span>
                <span className="font-semibold">{stats?.total_users ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
