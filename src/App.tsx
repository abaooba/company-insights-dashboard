import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Factors from "./pages/Factors.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AnalysisJobProvider, FactorJobProvider } from "@/lib/backgroundJobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Job state lives above the router so an in-flight analysis keeps running
          (and its result is retained) when you switch tabs. */}
      <AnalysisJobProvider>
        <FactorJobProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/factors" element={<Factors />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FactorJobProvider>
      </AnalysisJobProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
