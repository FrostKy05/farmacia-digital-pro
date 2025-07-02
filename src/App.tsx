
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PharmacyProvider } from "@/contexts/PharmacyContext";
import Layout from "@/components/Layout";
import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard";
import Products from "@/pages/Products";
import Sales from "@/pages/Sales";
import ConfigPage from "@/pages/ConfigPage";
import { useAuth } from "@/contexts/AuthContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pharmacy-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-pharmacy-gradient rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/ventas" element={<Sales />} />
        {user.role === 'admin' && (
          <Route path="/configuracion" element={<ConfigPage />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PharmacyProvider>
            <AppContent />
          </PharmacyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
