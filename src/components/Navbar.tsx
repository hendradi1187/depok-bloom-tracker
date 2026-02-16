import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Leaf,
  LayoutDashboard,
  ScanLine,
  BookOpen,
  Settings,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Katalog", href: "/catalog", icon: BookOpen },
  { label: "Scanner", href: "/scanner", icon: ScanLine },
  { label: "Admin", href: "/admin", icon: Settings },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold leading-tight text-foreground">
              Flora Depok
            </p>
            <p className="text-[10px] font-medium leading-tight text-muted-foreground">
              Katalog Tanaman Hias
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
          <Link to="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </Link>
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
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
