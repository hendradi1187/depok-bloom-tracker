import Layout from "@/components/Layout";
import { MOCK_PLANTS } from "@/data/mockData";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, X, ScanLine, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Plant } from "@/data/mockData";

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Plant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setError(null);
    setResult(null);
    setScanning(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanResult(decodedText);
          stopScanner();
        },
        () => {}
      );
    } catch (err) {
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const handleScanResult = (code: string) => {
    const plant = MOCK_PLANTS.find(
      (p) => p.barcode.toLowerCase() === code.toLowerCase()
    );
    if (plant) {
      setResult(plant);
    } else {
      setError(`Barcode "${code}" tidak ditemukan dalam database.`);
    }
  };

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      handleScanResult(manualCode.trim());
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Layout>
      <div className="container py-8 max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary mb-4">
            <ScanLine className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Scan Tanaman</h1>
          <p className="text-muted-foreground mt-1">Arahkan kamera ke barcode atau QR code tanaman</p>
        </div>

        {/* Scanner area */}
        {!result && (
          <div className="rounded-xl border border-border/50 bg-card shadow-soft overflow-hidden">
            {scanning ? (
              <div className="relative">
                <div id="scanner-container" ref={containerRef} className="w-full" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-3 right-3 z-10"
                  onClick={stopScanner}
                >
                  <X className="h-4 w-4 mr-1" /> Tutup
                </Button>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center">
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center mb-6 bg-primary/5">
                  <Camera className="h-16 w-16 text-primary/40" />
                </div>
                <Button onClick={startScanner} className="bg-gradient-primary text-primary-foreground gap-2 shadow-elevated">
                  <Camera className="h-5 w-5" /> Buka Kamera
                </Button>
              </div>
            )}

            {/* Manual input */}
            <div className="p-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2 text-center">Atau masukkan kode manual</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="DPK-ORN-001"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" onClick={handleManualSearch}>Cari</Button>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => { setError(null); setManualCode(""); }}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-xl border border-border/50 bg-card shadow-elevated overflow-hidden animate-scale-in">
            <div className="p-6 bg-gradient-primary text-primary-foreground text-center">
              <p className="text-sm font-medium opacity-80">Tanaman Ditemukan!</p>
              <h2 className="font-display text-2xl font-bold mt-1">{result.common_name}</h2>
              <p className="text-sm italic opacity-70">{result.latin_name}</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{result.category}</Badge>
                <Badge className="font-mono bg-muted text-muted-foreground">{result.barcode}</Badge>
              </div>
              <p className="text-sm text-foreground/80">{result.description}</p>
              <div className="flex gap-2 pt-2">
                <Link to={`/plant/${result.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-primary text-primary-foreground">Detail Lengkap</Button>
                </Link>
                <Button variant="outline" onClick={() => { setResult(null); setManualCode(""); }}>
                  Scan Lagi
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-xs font-semibold text-muted-foreground mb-2">💡 Tips Scanning</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Pastikan barcode terlihat jelas dan tidak rusak</li>
            <li>• Gunakan pencahayaan yang cukup</li>
            <li>• Coba kode: <span className="font-mono text-primary">DPK-ORN-001</span> untuk demo</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
