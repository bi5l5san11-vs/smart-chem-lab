import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// إزالة أي عناصر تابعة لـ Lovable من الصفحة
const removeLovableElements = () => {
  const selectors = [
    '#lovable-badge',
    '#lovable',
    '[id*="lovable"]',
    '.lovable',
  ];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.remove();
    });
  });
};

const App = () => {
  useEffect(() => {
    removeLovableElements();
    // فحص دوري لإزالة أي عناصر تُضاف ديناميكيًا
    const interval = setInterval(removeLovableElements, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
