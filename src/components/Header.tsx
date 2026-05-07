import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { LogIn, LogOut, Crown, Menu, X } from "lucide-react";
import logo from "@/assets/noor-logo.png";
import { useAuth } from "@/hooks/useAuth";
import { useMembership } from "@/hooks/useMembership";

const navLinks: Array<{ label: string; href: string; isRoute?: boolean; authRequired?: boolean; isExternal?: boolean }> = [
  { label: "ড্যাশবোর্ড", href: "/dashboard", isRoute: true, authRequired: true },
  { label: "কোর্স", href: "/dashboard/courses", isRoute: true, authRequired: true },
  { label: "কমিউনিটি", href: "/dashboard/community", isRoute: true, authRequired: true },
  { label: "প্রোফাইল", href: "/dashboard/profile", isRoute: true, authRequired: true },
];

function MembershipBadge() {
  const { isProActive } = useMembership();
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isProActive ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
    }`}>
      <Crown className="h-3 w-3" />
      {isProActive ? 'Pro' : 'Free'}
    </div>
  );
}

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getHref = (link: typeof navLinks[0]) => {
    if (link.isRoute) {
      if (link.authRequired && !user) {
        return `/auth?redirect=${encodeURIComponent(link.href)}`;
      }
      return link.href;
    }
    return isDashboard ? `/${link.href}` : link.href;
  };

  const renderNavLink = (link: typeof navLinks[0], className: string, onClick?: () => void) => {
    if (link.isExternal) {
      return (
        <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
          {link.label}
        </a>
      );
    }
    const href = getHref(link);
    if (link.isRoute || isDashboard) {
      return (
        <Link key={link.label} to={href} className={className} onClick={onClick}>
          {link.label}
        </Link>
      );
    }
    return (
      <a key={link.label} href={href} className={className} onClick={onClick}>
        {link.label}
      </a>
    );
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img src={logo} alt="Noor Handicraft Academy" className="h-12 md:h-14" />
        </Link>

        {/* Nav Links - desktop */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) =>
            renderNavLink(link, "text-[hsl(0,0%,30%)] hover:text-[hsl(0,0%,0%)] text-sm font-semibold tracking-wider transition-colors")
          )}
        </nav>

        {/* Right side - desktop */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <MembershipBadge />
              <Link
                to="/dashboard"
                className="px-4 py-1.5 text-sm text-[hsl(0,0%,20%)] border border-primary rounded-md hover:bg-primary/10 transition-colors font-medium"
              >
                ড্যাশবোর্ড
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-1.5 text-sm text-[hsl(0,0%,20%)] border border-muted-foreground/30 rounded-md hover:bg-muted transition-colors font-medium flex items-center gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                লগআউট
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-1.5 text-sm text-[hsl(0,0%,20%)] border border-primary rounded-md hover:bg-primary/10 transition-colors font-medium flex items-center gap-1.5"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link
                to="/auth"
                className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-bold tracking-wide"
              >
                JOIN NOW
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="lg:hidden ml-auto p-2 rounded-md bg-[hsl(0,0%,15%)] text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) =>
                renderNavLink(
                  link,
                  "text-[hsl(0,0%,20%)] text-sm font-semibold tracking-wider py-2 border-b border-muted",
                  () => setMobileMenuOpen(false)
                )
              )}

              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <MembershipBadge />
                  </div>
                  <Link
                    to="/dashboard"
                    className="py-2 text-sm font-medium text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    ড্যাশবোর্ড
                  </Link>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="py-2 text-sm font-medium text-[hsl(0,0%,30%)] flex items-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/auth"
                    className="px-4 py-2 text-sm border border-primary rounded-md hover:bg-primary/10 font-medium flex items-center gap-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="px-5 py-2 text-sm bg-primary text-primary-foreground rounded-md font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    JOIN NOW
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
