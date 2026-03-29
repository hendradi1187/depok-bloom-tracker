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
  Printer,
  ClipboardList,
  ChevronDown,
  BarChart3,
  Users,
  User,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import depokLogo from "@/assets/depok-logo.png";
import { useAuth } from "@/context/AuthContext";
import NotificationPanel from "./NotificationPanel";

// Public navigation items (always visible)
const publicNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Katalog", href: "/catalog", icon: BookOpen },
  { label: "Peta", href: "/map", icon: Map },
  { label: "Scanner", href: "/scanner", icon: ScanLine },
];

// Officer navigation items (officer + admin)
const officerNavItems = [
  { label: "Riwayat Scan", href: "/officer/scans", icon: ClipboardList },
];

// Admin dropdown menu items (admin only)
const adminMenuItems = [
  { label: "Dashboard Admin", href: "/admin", icon: LayoutDashboard },
  { label: "Statistik", href: "/admin/stats", icon: BarChart3 },
  { label: "Kelola User", href: "/admin/users", icon: Users },
  { label: "Cetak Label", href: "/admin/print", icon: Printer },
];

const roleLabel: Record<string, string> = {
  admin: "Admin",
  officer: "Petugas",
  public: "Publik",
};

const roleBadgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  admin: "default",
  officer: "secondary",
  public: "outline",
};

// Generate user initials for avatar
function getInitials(name: string): string {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  // Check user roles
  const isOfficer = user?.role === "officer" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  // Check if current page is in admin section
  const isAdminSection = location.pathname.startsWith("/admin");

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <img src={depokLogo} alt="Logo Kota Depok" className="h-10 w-10 object-contain shrink-0" />
          <div className="hidden sm:block">
            <p className="font-display text-sm font-bold leading-tight text-foreground">
              Flora Depok
            </p>
            <p className="text-xs font-medium leading-tight text-muted-foreground">
              Katalog Tanaman Hias · Kota Depok
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {/* Public navigation items */}
          {publicNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Officer navigation items */}
          {isOfficer && officerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin dropdown menu */}
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 h-auto rounded-md text-sm font-medium transition-colors",
                    isAdminSection
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          isActive && "bg-accent"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notification Bell - visible for all logged-in users (admin/officer/public) */}
          {user && (
            <div className="flex items-center">
              <NotificationPanel />
            </div>
          )}

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2.5 px-2 py-1.5 h-auto rounded-md hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-sm font-medium leading-none">{user.name}</span>
                      <Badge
                        variant={roleBadgeVariant[user.role] ?? "outline"}
                        className="text-xs h-4 px-1.5 font-medium"
                      >
                        {roleLabel[user.role] ?? user.role}
                      </Badge>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil Saya</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href="https://github.com/hendradi1187/depok-bloom-tracker/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Bantuan & Dukungan</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                <LogIn className="h-4 w-4" />
                Masuk
              </Button>
            </Link>
          )}
          {/* Mobile notification bell - show on small screens */}
          {user && (
            <div className="md:hidden">
              <NotificationPanel />
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur animate-in slide-in-from-top-2 duration-200">
          <nav className="container py-3 flex flex-col gap-1.5">
            {/* Public navigation items */}
            {publicNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Officer navigation items */}
            {isOfficer && officerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Admin menu (collapsible) */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                    isAdminSection
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    Admin
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      mobileAdminOpen && "rotate-180"
                    )}
                  />
                </button>
                {mobileAdminOpen && (
                  <div className="ml-4 pl-4 border-l border-border/50 flex flex-col gap-1.5 mt-1.5">
                    {adminMenuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {/* Mobile user section */}
            {user ? (
              <>
                {/* User info card */}
                <div className="mt-2 mb-1.5 mx-1 p-3 rounded-md bg-accent/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate leading-none mb-1">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate leading-none mb-1.5">{user.email}</p>
                      <Badge
                        variant={roleBadgeVariant[user.role] ?? "outline"}
                        className="text-xs h-4 px-1.5 font-medium"
                      >
                        {roleLabel[user.role] ?? user.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Profile actions */}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <User className="h-4 w-4" />
                  Profil Saya
                </Link>
                <a
                  href="https://github.com/hendradi1187/depok-bloom-tracker/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  Bantuan & Dukungan
                </a>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full text-left transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
