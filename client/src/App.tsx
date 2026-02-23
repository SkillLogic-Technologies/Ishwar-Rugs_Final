import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/components/ScrollToTop";

import ModernNavigation from "@/components/modern-navigation";
import ModernFooter from "@/components/modern-footer";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";
import axios from "axios";

import TrackVisit from "@/components/TrackVisit";

// Public pages
import Home from "@/pages/home";
import Collections from "@/pages/collections";
import CollectionDetail from "@/pages/collection-detail";
import ProductDetail from "@/pages/ProductDetail";
import CategoryPage from "@/pages/category/category";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Stories from "@/pages/stories";
import NotFound from "@/pages/not-found";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import Verify from "@/pages/verify";

// Admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminCollections from "@/pages/admin/collections";
import AdminCategories from "@/pages/admin/categories";
import AdminAddCategory from "@/pages/admin/AddCategory";
import AdminProducts from "@/pages/admin/products";
import AdminAddProducts from "@/pages/admin/AddProduct";
import InquiriesPage from "@/pages/admin/inquiries";
import InquiryDetailPage from "@/pages/admin/InquiryDetailPage";
import AdminCustomers from "@/pages/admin/customers";
import AdminOrders from "@/pages/admin/orders";
import AdminLayout from "@/pages/admin/AdminLayout";
import AddCollection from "@/pages/admin/AddCollection";

import "@/components/styles/carousel.css";

function Router() {
  const { setWishlistCount } = useWishlist();
  const { setCartCount } = useCart();
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  const fetchCartCount = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/cart", {
        withCredentials: true,
      });
      const items = res.data.items || [];
      const count = items.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0,
      );
      setCartCount(count);
    } catch {
      console.log("Cart count error");
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/wishlist", {
        withCredentials: true,
      });
      const items = res.data.data || [];
      setWishlistCount(items.length);
    } catch {
      console.log("Wishlist error");
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchCartCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TrackVisit />
      {!isAdminRoute && <ModernNavigation />}
      <ScrollToTop />

      <main className="flex-1">
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={Home} />
          <Route path="/collections" component={Collections} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/stories" component={Stories} />
          <Route path="/verify" component={Verify} />

          <Route path="/collections/:slug" component={CollectionDetail} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/category/:slug">
            <CategoryPage />
          </Route>
          <Route path="/wishlist">
            <WishlistPage />
          </Route>
          <Route path="/cart">
            <CartPage />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" component={AdminLogin} />

          <Route path="/admin/dashboard">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </Route>

          <Route path="/admin/collections">
            <AdminLayout>
              <AdminCollections />
            </AdminLayout>
          </Route>

          <Route path="/admin/add-collection">
            <AdminLayout>
              <AddCollection />
            </AdminLayout>
          </Route>

          <Route path="/admin/edit-collection/:slug">
            <AdminLayout>
              <AddCollection />
            </AdminLayout>
          </Route>

          <Route path="/admin/products">
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </Route>

          <Route path="/admin/add-products">
            <AdminLayout>
              <AdminAddProducts />
            </AdminLayout>
          </Route>

          <Route path="/admin/edit-products/:slug">
            <AdminLayout>
              <AdminAddProducts />
            </AdminLayout>
          </Route>

          <Route path="/admin/categories">
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </Route>

          <Route path="/admin/add-categories">
            <AdminLayout>
              <AdminAddCategory />
            </AdminLayout>
          </Route>

          <Route path="/admin/edit-category/:slug">
            <AdminLayout>
              <AdminAddCategory />
            </AdminLayout>
          </Route>

          <Route path="/admin/inquiries">
            <AdminLayout>
              <InquiriesPage />
            </AdminLayout>
          </Route>

          <Route path="/admin/inquiries/:id">
            <AdminLayout>
              <InquiryDetailPage />
            </AdminLayout>
          </Route>

          <Route path="/admin/customers">
            <AdminLayout>
              <AdminCustomers />
            </AdminLayout>
          </Route>

          <Route path="/admin/orders">
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </Route>

          <Route component={NotFound} />
        </Switch>
      </main>

      {!isAdminRoute && <ModernFooter />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ishwar-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster position="top-center" />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
