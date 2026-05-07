import logo from "@/assets/noor-logo.png";

export default function PromoHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <img src={logo} alt="Noor Handicraft Academy" className="h-9 w-auto" />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-extrabold">Noor</span>
            <span className="text-[10px] text-muted-foreground -mt-0.5">Handicraft Academy</span>
          </span>
        </a>
        <a
          href="#order"
          className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/25 hover:opacity-95"
        >
          এখনই অর্ডার করুন
        </a>
      </div>
    </header>
  );
}
