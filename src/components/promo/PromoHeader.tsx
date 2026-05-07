import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/ltdez-logo.png";

const links = [
  { label: "হোম", href: "/#hero", isRoute: false },
  { label: "কোর্স", href: "/#features", isRoute: false },
  { label: "লাইভ প্রোগ্রাম", href: "/live-program", isRoute: true },
];

export default function PromoHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5">
          <img src={logo} alt="LTDEZ" className="h-10 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-wide">LTDEZ</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Learn Through Mistakes</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) =>
            l.isRoute ? (
              <Link key={l.href} to={l.href} className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors">
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors">
                {l.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-white text-sm font-semibold hover:bg-muted"
          >
            <LogIn className="h-4 w-4" /> লগইন
          </Link>
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col">
              {links.map((l) =>
                l.isRoute ? (
                  <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="py-3 text-sm font-medium border-b border-border">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-sm font-medium border-b border-border">
                    {l.label}
                  </a>
                )
              )}
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex justify-center items-center gap-1.5 px-5 py-3 rounded-full border border-border text-sm font-semibold"
              >
                <LogIn className="h-4 w-4" /> লগইন
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
