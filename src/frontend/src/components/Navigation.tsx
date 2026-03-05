import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "User is already authenticated"
        ) {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/book", label: "Book Now" },
    { to: "/admin", label: "Admin" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shadow-gold">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="font-display text-xl font-semibold text-plum tracking-tight">
              Glamour <span className="text-gold">Parlour</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body ${
                  isActive(link.to)
                    ? "bg-secondary text-plum"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <span className="text-xs text-muted-foreground font-body">
                Logged in
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              data-ocid="nav.auth.button"
              className={
                isAuthenticated
                  ? "border-border text-foreground hover:bg-muted"
                  : "bg-plum hover:bg-plum/90 text-primary-foreground shadow-plum"
              }
            >
              {isLoggingIn
                ? "Logging in…"
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.mobile_menu.button"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                data-ocid={`nav.mobile.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all font-body ${
                  isActive(link.to)
                    ? "bg-secondary text-plum"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border">
              <Button
                onClick={() => {
                  handleAuth();
                  setMobileOpen(false);
                }}
                disabled={isLoggingIn}
                variant={isAuthenticated ? "outline" : "default"}
                size="sm"
                className={`w-full ${
                  isAuthenticated
                    ? "border-border text-foreground"
                    : "bg-plum hover:bg-plum/90 text-primary-foreground"
                }`}
                data-ocid="nav.mobile.auth.button"
              >
                {isLoggingIn
                  ? "Logging in…"
                  : isAuthenticated
                    ? "Logout"
                    : "Login"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
