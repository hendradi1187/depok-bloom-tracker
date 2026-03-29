import Layout from "@/components/Layout";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { useAuth } from "@/context/AuthContext";
import { useScans } from "@/hooks/useScans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, MapPin, Calendar, Package } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function OfficerScans() {
  const { user } = useAuth();
  const { data: scansData, isLoading } = useScans({ userId: user?.id, limit: 50 });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 max-w-4xl">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const scans = scansData?.data || [];

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <BreadcrumbNav />

        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold">Riwayat Pemindaian Saya</h1>
            <p className="text-muted-foreground">
              Daftar tanaman yang telah Anda pindai
            </p>
          </div>
        </div>

        {scans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Belum Ada Riwayat Pemindaian
              </p>
              <p className="text-sm text-muted-foreground">
                Gunakan fitur Scanner untuk mulai memindai tanaman
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total {scans.length} pemindaian
              </p>
            </div>

            {scans.map((scan) => (
              <Card key={scan.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {scan.plant?.common_name || "Tanaman"}
                      </CardTitle>
                      <p className="text-sm italic text-muted-foreground">
                        {scan.plant?.latin_name}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {scan.plant?.category || "N/A"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(scan.scanned_at), "dd MMMM yyyy, HH:mm", {
                        locale: idLocale,
                      })}
                    </span>
                  </div>
                  {scan.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{scan.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Barcode: {scan.plant?.barcode}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
