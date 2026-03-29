import { NavLink } from "react-router-dom"
import { LayoutDashboard, BarChart3, Users, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

const navItems = [
  { to: "/admin",       label: "Dashboard",   icon: LayoutDashboard, end: true,  adminOnly: false },
  { to: "/admin/stats", label: "Statistik",   icon: BarChart3,       end: false, adminOnly: false },
  { to: "/admin/users", label: "Pengguna",    icon: Users,           end: false, adminOnly: true },
  { to: "/admin/print", label: "Cetak Label", icon: Printer,         end: false, adminOnly: true },
]

export default function AdminNav() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  // Filter nav items berdasarkan role
  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin)

  return (
    <div className="flex gap-1 mb-6 border-b border-border/50 pb-1">
      {visibleItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-t text-sm font-medium transition-colors",
              isActive
                ? "text-primary border-b-2 border-primary -mb-[3px]"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </div>
  )
}
