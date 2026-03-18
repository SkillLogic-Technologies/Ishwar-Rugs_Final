import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  Sun,
  Moon,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import Login from "@/pages/login";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ModernNavigation() {

  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);

  const { theme, setTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const { cartCount, setCartCount } = useCart();

  const [location, navigate] = useLocation();

  const isVerifyPage = location === "/verify";

  type VerifiedUser = {
    username: string;
    email?: string;
  };

  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  useEffect(() => {
    const loadUser = () => {
      const user = localStorage.getItem("verifiedUser");
      setVerifiedUser(user ? JSON.parse(user) : null);
    };

    loadUser();
    window.addEventListener("userVerified", loadUser);

    return () => {
      window.removeEventListener("userVerified", loadUser);
    };
  }, []);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("/api/collection/");
        const data = await res.json();

        if (data.success) {
          const filtered = data.data.filter((c: any) =>
            ["Velura Collection", "Velura Persian", "Flowing Aura"].includes(
              c.name
            )
          );
          setCollections(filtered);
        }
      } catch (err) {
        console.error("Collections fetch error:", err);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const refreshCart = async () => {
      try {
        const res = await axios.get(
          "/api/user/cart",
          { withCredentials: true }
        );

        const items = res.data.items || [];

        const count = items.reduce(
          (acc: number, item: any) => acc + item.quantity,
          0
        );

        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    refreshCart();

    window.addEventListener("cartUpdated", refreshCart);
    window.addEventListener("userVerified", refreshCart);

    return () => {
      window.removeEventListener("cartUpdated", refreshCart);
      window.removeEventListener("userVerified", refreshCart);
    };
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("verifiedUser");
    setVerifiedUser(null);

    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-effect border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-8">

        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">

            <Link href="/">

              <img
                src="/logo/Logo.png"
                alt="Ishwar Rugs Logo"
                className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
              />

            </Link>

          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">

            <Link
              href="/"
              className={`text-sm font-semibold ${
                location === "/"
                  ? "text-premium-gold"
                  : "text-foreground hover:text-premium-gold"
              }`}
            >
              HOME
            </Link>

            <NavigationMenu>
              <NavigationMenuList>

                <NavigationMenuItem>

                  <NavigationMenuTrigger className="text-sm font-semibold">
                    COLLECTIONS
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>

                    <div className="w-96 p-8 glass-effect">
                      <div className="space-y-4">
                        <h4 className="font-serif text-xl font-bold text-premium-gold mb-6">
                          Browse Collections
                        </h4>
                        <div className="grid gap-3">
                          {collections.length > 0 ? (
                            collections.map((c) => (
                              <NavigationMenuLink key={c._id} asChild>
                                <Link
                                  href={`/collections/${c.slug}`}
                                  className="block px-4 py-3 text-sm text-foreground hover:text-premium-gold hover:bg-white/5 rounded-lg transition-all duration-300"
                                >
                                  <div className="font-semibold">{c.name}</div>
                                  <div className="text-xs text-foreground/60 mt-1">{c.description}</div>
                                </Link>
                              </NavigationMenuLink>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-foreground/60">Loading...</div>
                          )}
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/collections" // View All Collections
                                className="block px-4 py-3 text-sm text-premium-gold font-bold hover:bg-white/5 rounded-lg transition-all duration-300"
                              >
                                View All Collections →
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </div>
                      </div>

                    </div>

                  </NavigationMenuContent>

                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/about">HERITAGE</Link>
            <Link href="/stories">STORIES</Link>
            <Link href="/contact">CONTACT</Link>

          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            <Button variant="ghost" size="icon">
              <Search />
            </Button>

            <Link href="/wishlist">

              <Button variant="ghost" size="icon" className="relative">

                <Heart />

                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>

              </Button>

            </Link>

            <Link href="/cart">

              <Button variant="ghost" size="icon" className="relative">

                <ShoppingBag />

                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>

              </Button>

            </Link>

            {/* User */}
            <div className="relative group">

              <Button variant="ghost" size="icon">

                {verifiedUser?.username ? (

                  <div className="h-8 w-8 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
                    {verifiedUser.username.charAt(0).toUpperCase()}
                  </div>

                ) : (
                  <User />
                )}

              </Button>

              <div className="absolute right-0 mt-3 w-44 rounded-xl bg-white dark:bg-[#1c1917] border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">

                {!isVerifyPage && verifiedUser && (
                  <>
                    <button
                      onClick={() => navigate("/orders")}
                      className="block w-full text-left px-5 py-3"
                    >
                      My Orders
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-3"
                    >
                      Logout
                    </button>
                  </>
                )}

                {!verifiedUser && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="block w-full text-left px-5 py-3"
                  >
                    Login
                  </button>
                )}

              </div>

            </div>

            {/* Mobile + Tablet Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>

              <SheetTrigger asChild>

                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>

              </SheetTrigger>

              <SheetContent side="right">

                <div className="flex flex-col space-y-6 mt-8 text-lg font-semibold">

                  <Link href="/" onClick={() => setIsOpen(false)}>HOME</Link>

                  <Link href="/collections" onClick={() => setIsOpen(false)}>
                    COLLECTIONS
                  </Link>

                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    HERITAGE
                  </Link>

                  <Link href="/stories" onClick={() => setIsOpen(false)}>
                    STORIES
                  </Link>

                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    CONTACT
                  </Link>

                </div>

              </SheetContent>

            </Sheet>

          </div>

        </div>
      </div>

      {showLogin && (
        <div
          className="my-24 flex items-center justify-center"
          onClick={() => setShowLogin(false)}
        >

          <div
            className="relative w-[90%] max-w-md p-8 rounded-2xl bg-[#020617] border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-3 right-3 text-white"
            >
              ✖
            </button>

            <Login />

          </div>

        </div>
      )}

    </nav>
  );
}