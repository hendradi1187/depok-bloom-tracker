import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";

// Eager load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";

// Lazy load non-critical pages for code splitting
const Catalog = lazy(() => import("./pages/Catalog"));
const PlantDetail = lazy(() => import("./pages/PlantDetail"));
const Scanner = lazy(() => import("./pages/Scanner"));
const MapView = lazy(() => import("./pages/MapView"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminStats = lazy(() => import("./pages/admin/Stats"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const PrintBarcodes = lazy(() => import("./pages/admin/PrintBarcodes"));
const OfficerScans = lazy(() => import("./pages/officer/Scans"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-sm text-muted-foreground">Memuat halaman...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/plant/:id" element={<PlantDetail />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/login" element={<Login />} />

              {/* Officer Routes */}
              <Route
                path="/officer/scans"
                element={
                  <RequireAuth role="officer">
                    <OfficerScans />
                  </RequireAuth>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <RequireAuth role="admin">
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <RequireAuth role="officer">
                    <AdminStats />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RequireAuth role="admin">
                    <AdminUsers />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/print"
                element={
                  <RequireAuth role="admin">
                    <PrintBarcodes />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
