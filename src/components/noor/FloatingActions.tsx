import { MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      {/* WhatsApp button */}
      <a
        href="https://wa.me/8801711282515"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-20 sm:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-xl shadow-green-500/40 flex items-center justify-center hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur border-t border-border">
        <a
          href="/#courses"
          className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30"
        >
          কোর্সসমূহ দেখুন
        </a>
      </div>
    </>
  );
}
