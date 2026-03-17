import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/theme-provider";
import App from "./App";
import "./index.css";





createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light">
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  </ThemeProvider>
);
