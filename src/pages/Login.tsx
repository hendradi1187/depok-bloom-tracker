import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import depokLogo from "@/assets/depok-logo.png";
import { useLoginMutation } from "@/hooks/useLoginMutation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password }, {
      onSuccess: () => navigate("/admin"),
      onError: () => {},
    });
  };

  return (
    <Layout hideNav>
      <div className="min-h-screen flex">
        {/* Left - form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-10">
              <img src={depokLogo} alt="Logo Kota Depok" className="h-10 w-10 object-contain" />
              <div>
                <p className="font-display text-sm font-bold leading-tight text-foreground">Flora Depok</p>
                <p className="text-[10px] font-medium leading-tight text-muted-foreground">Katalog Tanaman Hias · Kota Depok</p>
              </div>
            </Link>

            <h1 className="font-display text-2xl font-bold text-foreground">Masuk ke Akun</h1>
            <p className="text-sm text-muted-foreground mt-1 mb-8">
              Gunakan akun resmi Anda untuk mengakses sistem
            </p>

            {loginMutation.isError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                Email atau password salah. Silakan coba lagi.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@depok.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-primary-foreground shadow-soft"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Hubungi admin untuk mendapatkan akses akun
            </p>
          </div>
        </div>

        {/* Right - decorative */}
        <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">🌿</div>
            <h2 className="font-display text-3xl font-bold text-primary-foreground">
              Sistem Katalog Digital
            </h2>
            <p className="mt-3 text-primary-foreground/70 leading-relaxed">
              Kelola dan monitoring tanaman hias Kota Depok secara digital dan terintegrasi.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
