import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/ltdez-logo.png";

const links = [
  { label: "হোম", href: "#hero" },
  { label: "সমস্যা", href: "#problem" },
  { label: "সমাধান", href: "#solution" },
  { label: "ফিচার", href: "#features" },
  { label: "কোর্সসমূহ", href: "#courses" },
  { label: "রিভিউ", href: "#reviews" },
];

export default function NoorHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="LTDEZ" className="h-10 md:h-12 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-base md:text-lg font-extrabold text-foreground">Noor</span>
            <span className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">Handicraft Academy</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/75 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#courses"
            className="hidden sm:inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-95"
          >
            এখনই জয়েন করুন
          </a>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
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
            className="lg:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium border-b border-border last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#courses"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold"
              >
                এখনই জয়েন করুন
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
