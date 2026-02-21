import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScanLine,
  BookOpen,
  Settings,
  Menu,
  X,
  LogIn,
  LogOut,
  Map,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import depokLogo from "@/assets/depok-logo.png";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Katalog", href: "/catalog", icon: BookOpen },
  { label: "Peta", href: "/map", icon: Map },
  { label: "Scanner", href: "/scanner", icon: ScanLine },
  { label: "Admin", href: "/admin", icon: Settings },
];

const roleLabel: Record<string, string> = {
  admin: "admin",
  officer: "petugas",
  public: "publik",
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={depokLogo} alt="Logo Kota Depok" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold leading-tight text-foreground">
              Flora Depok
            </p>
            <p className="text-[10px] font-medium leading-tight text-muted-foreground">
              Katalog Tanaman Hias · Kota Depok
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href || 
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{user.name}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/15 text-primary px-1.5 py-0.5 rounded">
                  {roleLabel[user.role] ?? user.role}
                </span>
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
            </Link>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card animate-fade-in">
          <nav className="container py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-foreground">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary/15 text-primary px-1.5 py-0.5 rounded">
                    {roleLabel[user.role] ?? user.role}
                  </span>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
