import { NavLink } from "react-router-dom"
import { LayoutDashboard, BarChart3, Users, Printer } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/admin",       label: "Dashboard",   icon: LayoutDashboard, end: true },
  { to: "/admin/stats", label: "Statistik",   icon: BarChart3,       end: false },
  { to: "/admin/users", label: "Pengguna",    icon: Users,           end: false },
  { to: "/admin/print", label: "Cetak Label", icon: Printer,         end: false },
]

export default function AdminNav() {
  return (
    <div className="flex gap-1 mb-6 border-b border-border/50 pb-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
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
