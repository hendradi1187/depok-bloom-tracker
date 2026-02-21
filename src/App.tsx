import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import PlantDetail from "./pages/PlantDetail";
import Scanner from "./pages/Scanner";
import MapView from "./pages/MapView";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStats from "./pages/admin/Stats";
import AdminUsers from "./pages/admin/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/plant/:id" element={<PlantDetail />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/login" element={<Login />} />
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
                <RequireAuth role="admin">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
