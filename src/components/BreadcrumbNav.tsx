import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

// Route label mapping untuk human-readable names
const routeLabels: Record<string, string> = {
  "admin": "Admin",
  "stats": "Statistik",
  "users": "Kelola User",
  "print": "Cetak Label",
  "catalog": "Katalog",
  "scanner": "Scanner",
  "map": "Peta",
  "officer": "Petugas",
  "scans": "Riwayat Scan",
  "plant": "Detail Tanaman",
  "profile": "Profil",
};

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  // Remove trailing slash and split path
  const paths = pathname.replace(/\/$/, "").split("/").filter(Boolean);

  // Always start with home
  const breadcrumbs: BreadcrumbSegment[] = [
    {
      label: "Dashboard",
      href: "/",
      isCurrentPage: pathname === "/",
    },
  ];

  // Build breadcrumb chain
  let currentPath = "";
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === paths.length - 1;

    // Skip if segment is an ID (cuid pattern or numeric)
    if (segment.match(/^[a-z0-9]{20,}$/i) || segment.match(/^\d+$/)) {
      return;
    }

    breadcrumbs.push({
      label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      isCurrentPage: isLast,
    });
  });

  return breadcrumbs;
}

export default function BreadcrumbNav() {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on homepage or if only 1 item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isCurrentPage ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href} className="flex items-center gap-1.5">
                    {index === 0 && <Home className="h-3.5 w-3.5" />}
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
