import { createRoot } from "react-dom/client";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import App from "./App";
import "./index.css";


createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <WishlistProvider>
      <App />
    </WishlistProvider>
  </CartProvider>
);
