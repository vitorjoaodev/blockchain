import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PropertyDetails from "@/pages/PropertyDetails";
import ListProperty from "@/pages/ListProperty";
import CategoryPage from "@/pages/CategoryPage";
import HowItWorks from "@/pages/HowItWorks";
import BrowseRentals from "@/pages/BrowseRentals";
import MyRentals from "@/pages/MyRentals";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties/:id" component={PropertyDetails} />
      <Route path="/properties" component={BrowseRentals} />
      <Route path="/list-property" component={ListProperty} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/my-rentals" component={MyRentals} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <Header />
          <main className="min-h-screen">
            <Router />
          </main>
          <Footer />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
