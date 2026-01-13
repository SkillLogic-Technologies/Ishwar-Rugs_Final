import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Sun, Moon, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
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
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed w-full top-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="cursor-pointer">
                <img
                  // src="https://i.postimg.cc/fy162xqr/Chat-GPT-Image-Jul-10-2025-02-12-10-PM.png"
                  src="/logo/Logo.png"
                  alt="Ishwar Rugs Logo"
                  className="h-20 w-auto" // larger size for clarity
                />
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
                          Browse by Style
                        </h4>
                        <div className="grid gap-3">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/collections?category=contemporary"
                              className="block px-4 py-3 text-sm text-foreground hover:text-premium-gold hover:bg-white/5 rounded-lg transition-all duration-300"
                            >
                              <div className="font-semibold">MOROCCAN</div>
                              <div className="text-xs text-foreground/60 mt-1">
                                Modern interpretations of classic designs
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/collections?category=modern"
                              className="block px-4 py-3 text-sm text-foreground hover:text-premium-gold hover:bg-white/5 rounded-lg transition-all duration-300"
                            >
                              <div className="font-semibold">INDIAN</div>
                              <div className="text-xs text-foreground/60 mt-1">
                                Bold geometric patterns and abstract art
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/collections?category=traditional"
                              className="block px-4 py-3 text-sm text-foreground hover:text-premium-gold hover:bg-white/5 rounded-lg transition-all duration-300"
                            >
                              <div className="font-semibold">TURKISH</div>
                              <div className="text-xs text-foreground/60 mt-1">
                                Heritage patterns with cultural significance
                              </div>
                            </Link>
                          </NavigationMenuLink>
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <NavigationMenuLink asChild>
                              <Link
                                href="/collections"
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

            <Link
              href="/about"
              className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                location === "/about"
                  ? "text-premium-gold"
                  : "text-foreground hover:text-premium-gold"
              }`}
            >
              HERITAGE
            </Link>

            <Link
              href="/stories"
              className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                location === "/stories"
                  ? "text-premium-gold"
                  : "text-foreground hover:text-premium-gold"
              }`}
            >
              STORIES
            </Link>

            <Link
              href="/contact"
              className={`text-sm font-semibold tracking-wide transition-all duration-300 ${
                location === "/contact"
                  ? "text-premium-gold"
                  : "text-foreground hover:text-premium-gold"
              }`}
            >
              CONTACT
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Shopping Bag */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-premium-gold hover:bg-white/10 transition-all duration-300 relative"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-premium-gold text-primary-brown text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-foreground hover:text-premium-gold"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 glass-effect border-white/10"
              >
                <div className="flex flex-col space-y-8 mt-8">
                  <Link
                    href="/"
                    className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    HOME
                  </Link>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-premium-gold mb-4">
                      Collections
                    </h4>
                    <div className="space-y-3 ml-4">
                      <Link
                        href="/collections?category=contemporary"
                        className="block text-foreground hover:text-premium-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Contemporary
                      </Link>
                      <Link
                        href="/collections?category=modern"
                        className="block text-foreground hover:text-premium-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Modern
                      </Link>
                      <Link
                        href="/collections?category=traditional"
                        className="block text-foreground hover:text-premium-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Traditional
                      </Link>
                      <Link
                        href="/collections"
                        className="block text-premium-gold font-bold hover:opacity-80 transition-opacity"
                        onClick={() => setIsOpen(false)}
                      >
                        View All →
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/about"
                    className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    HERITAGE
                  </Link>

                  <Link
                    href="/stories"
                    className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    STORIES
                  </Link>

                  <Link
                    href="/contact"
                    className="text-foreground hover:text-premium-gold transition-colors text-lg font-semibold tracking-wide"
                    onClick={() => setIsOpen(false)}
                  >
                    CONTACT
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
