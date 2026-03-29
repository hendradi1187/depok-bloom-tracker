import { ReactNode } from "react";
import Navbar from "./Navbar";
import depokLogo from "@/assets/depok-logo.png";

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
          <div className="flex items-center gap-2.5">
            <img src={depokLogo} alt="Logo Kota Depok" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-medium text-foreground">Katalog Tanaman Hias Kota Depok</p>
              <p>Dinas Ketahanan Pangan, Pertanian, dan Perikanan Kota Depok</p>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Pemerintah Kota Depok. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
