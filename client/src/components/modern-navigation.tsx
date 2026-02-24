import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Sun, Moon, Search, Heart, ShoppingBag, User } from "lucide-react";
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
  const { cartCount } = useCart();

  const [location, navigate] = useLocation();
  const token = localStorage.getItem("token");
  const isVerifyPage = location === "/verify";

  type VerifiedUser = { username: string; email?: string };
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUser | null>(null);

  // Load verified user
  useEffect(() => {
    const loadUser = () => {
      const user = sessionStorage.getItem("verifiedUser");
      setVerifiedUser(user ? JSON.parse(user) : null);
    };
    loadUser();
    window.addEventListener("userVerified", loadUser);
    return () => window.removeEventListener("userVerified", loadUser);
  }, []);

  // Fetch collections for dropdown
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/collection/");
        const data = await res.json();
        if (data.success) {
          // Filter only 3 collections for dropdown
          const filtered = data.data.filter((c: any) =>
            ["Velura Collection", "Velura Persian", "Flowing Aura"].includes(c.name)
          );
          setCollections(filtered);
        }
      } catch (err) {
        console.error("Collections fetch error:", err);
      }
    };
    fetchCollections();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/api/users/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error", err);
    }
    localStorage.removeItem("token");
    sessionStorage.removeItem("verifiedUser");
    setVerifiedUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed w-full top-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="cursor-pointer">
                <img src="/logo/Logo.png" alt="Ishwar Rugs Logo" className="h-20 w-auto" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-premium-gold bg-transparent text-sm font-semibold tracking-wide">
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

            {/* Other links */}
            <Link href="/about" className={`text-sm font-semibold tracking-wide transition-all duration-300 ${location === "/about" ? "text-premium-gold" : "text-foreground hover:text-premium-gold"}`}>HERITAGE</Link>
            <Link href="/stories" className={`text-sm font-semibold tracking-wide transition-all duration-300 ${location === "/stories" ? "text-premium-gold" : "text-foreground hover:text-premium-gold"}`}>STORIES</Link>
            <Link href="/contact" className={`text-sm font-semibold tracking-wide transition-all duration-300 ${location === "/contact" ? "text-premium-gold" : "text-foreground hover:text-premium-gold"}`}>CONTACT</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Search */}
            <Button variant="ghost" size="icon" className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300"><Search className="h-5 w-5" /></Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300 relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{wishlistCount}</span>
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300 relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-premium-gold text-primary-brown text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>
              </Button>
            </Link>

            {/* User */}
            <div className="relative group">
              <Button variant="ghost" size="icon" className="text-gray-800 dark:text-white hover:text-yellow-600 dark:hover:text-premium-gold hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 relative">
                {verifiedUser?.username ? (
                  <div className="h-8 w-8 rounded-full bg-yellow-500 text-black flex items-center justify-center text-sm font-bold">
                    {verifiedUser.username.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>

              {/* Dropdown */}
              <div className="absolute right-0 mt-3 w-44 rounded-xl bg-white dark:bg-[#1c1917] border border-gray-200 dark:border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {isVerifyPage && (
                  <>
                    <button onClick={() => navigate("/verify")} className="block w-full text-left px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">Verify</button>
                    <div className="border-t border-gray-200 dark:border-white/10" />
                    <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">Logout</button>
                  </>
                )}
                {!isVerifyPage && token && (
                  <button onClick={handleLogout} className="w-full text-left px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">Logout</button>
                )}
                {!isVerifyPage && !token && (
                  <button onClick={() => setShowLogin(true)} className="block w-full text-left px-5 py-3 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition">Login</button>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:text-premium-gold">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-effect border-white/10">
                <div className="flex flex-col space-y-8 mt-8">
                  <Link href="/" className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide" onClick={() => setIsOpen(false)}>HOME</Link>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-premium-gold mb-4">Collections</h4>
                    <div className="space-y-3 ml-4">
                      <Link href="/collections?category=contemporary" className="block text-foreground hover:text-premium-gold transition-colors" onClick={() => setIsOpen(false)}>Contemporary</Link>
                      <Link href="/collections?category=modern" className="block text-foreground hover:text-premium-gold transition-colors" onClick={() => setIsOpen(false)}>Modern</Link>
                      <Link href="/collections?category=traditional" className="block text-foreground hover:text-premium-gold transition-colors" onClick={() => setIsOpen(false)}>Traditional</Link>
                      <Link href="/collections" className="block text-premium-gold font-bold hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>View All →</Link>
                    </div>
                  </div>

                  <Link href="/about" className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide" onClick={() => setIsOpen(false)}>HERITAGE</Link>
                  <Link href="/stories" className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide" onClick={() => setIsOpen(false)}>STORIES</Link>
                  <Link href="/contact" className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide" onClick={() => setIsOpen(false)}>CONTACT</Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="my-24 flex items-center justify-center z-50" onClick={() => setShowLogin(false)}>
          <div className="relative w-[90%] max-w-md p-8 rounded-2xl bg-[#020617] border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowLogin(false)} className="absolute top-3 right-3 text-white text-lg">✖</button>
            <Login />
          </div>
        </div>
      )}
    </nav>
  );
}