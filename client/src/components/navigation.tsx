import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User, BadgeCheck } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="bg-warm-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img
                  src="https://res.cloudinary.com/dzufohihn/image/upload/v1767769166/Chat-GPT-Image-Jul-10-2025-02-12-10-PM_hzqpxx.png"
                  alt="Ishwar Rugs Logo"
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="font-serif text-2xl font-bold text-primary-brown hover:text-warm-gold transition-colors">
                    Ishwar Rugs
                  </h1>
                  <div className="text-xs tracking-[0.3em] text-foreground/80 font-sans uppercase">
                    Est. 1925
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-primary-brown hover:text-warm-gold bg-transparent">
                    Collections
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-80 p-6">
                      <div className="space-y-3">
                        <h4 className="font-serif text-lg font-semibold text-primary-brown mb-4">
                          Browse by Style
                        </h4>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/collections?category=contemporary"
                            className="block px-4 py-2 text-sm text-primary-brown hover:bg-soft-gray rounded transition-colors"
                          >
                            Contemporary
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/collections?category=modern"
                            className="block px-4 py-2 text-sm text-primary-brown hover:bg-soft-gray rounded transition-colors"
                          >
                            Modern
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/collections?category=traditional"
                            className="block px-4 py-2 text-sm text-primary-brown hover:bg-soft-gray rounded transition-colors"
                          >
                            Traditional
                          </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/collections"
                            className="block px-4 py-2 text-sm text-warm-gold font-semibold hover:bg-soft-gray rounded transition-colors"
                          >
                            View All Collections
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              href="/about"
              className={`text-primary-brown hover:text-warm-gold transition-colors ${
                location === "/about" ? "text-warm-gold" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-primary-brown hover:text-warm-gold transition-colors ${
                location === "/contact" ? "text-warm-gold" : ""
              }`}
            >
              Custom Design
            </Link>
            <Link
              href="/contact"
              className={`text-primary-brown hover:text-warm-gold transition-colors ${
                location === "/contact" ? "text-warm-gold" : ""
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-brown hover:text-warm-gold"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-primary-brown"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-warm-white">
                <div className="flex flex-col space-y-6 mt-6">
                  <Link
                    href="/"
                    className="text-primary-brown hover:text-warm-gold transition-colors text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <div>
                    <h4 className="font-serif text-lg font-semibold text-primary-brown mb-3">
                      Collections
                    </h4>
                    <div className="space-y-2 ml-4">
                      <Link
                        href="/collections?category=contemporary"
                        className="block text-primary-brown hover:text-warm-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Contemporary
                      </Link>
                      <Link
                        href="/collections?category=modern"
                        className="block text-primary-brown hover:text-warm-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Modern
                      </Link>
                      <Link
                        href="/collections?category=traditional"
                        className="block text-primary-brown hover:text-warm-gold transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Traditional
                      </Link>
                      <Link
                        href="/collections"
                        className="block text-warm-gold font-semibold hover:opacity-80 transition-opacity"
                        onClick={() => setIsOpen(false)}
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                  <Link
                    href="/about"
                    className="text-primary-brown hover:text-warm-gold transition-colors text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-primary-brown hover:text-warm-gold transition-colors text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Custom Design
                  </Link>
                  <Link
                    href="/contact"
                    className="text-primary-brown hover:text-warm-gold transition-colors text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
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
