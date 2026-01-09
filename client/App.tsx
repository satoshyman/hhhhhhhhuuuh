import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import Referrals from "./pages/Referrals";
import Withdraw from "./pages/Withdraw";
import NotFound from "./pages/NotFound";
import { BottomNavigation } from "./components/BottomNavigation";
import { AdminPanel } from "./components/AdminPanel";
import { AppProvider } from "./lib/AppProvider";
import { useSecretUnlock } from "./hooks/useSecretUnlock";

const queryClient = new QueryClient();

function AppContent() {
  const { isUnlocked, lock } = useSecretUnlock('', 8);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  // Open admin panel when unlocked
  const handleAdminPanel = () => {
    if (isUnlocked) {
      setAdminPanelOpen(true);
      lock();
    }
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto relative">
      <div onClick={handleAdminPanel}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/withdraw" element={<Withdraw />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNavigation />
      <AdminPanel isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </div>
  );
}

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<AppWrapper />);
