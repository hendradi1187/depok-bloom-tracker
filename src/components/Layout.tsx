import { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function Layout({ children, hideNav }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideNav && <Navbar />}
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60 bg-card/50">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2024 Pemerintah Kota Depok — Dinas Pertamanan dan Kebersihan</p>
          <p className="font-medium">Katalog Tanaman Hias Kota Depok v1.0</p>
        </div>
      </footer>
    </div>
  );
}
