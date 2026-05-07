import { useEffect, useState } from "react";
import { ArrowRight, Radio } from "lucide-react";

function getNextFriday9pm() {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay();
  const diff = (5 - day + 7) % 7 || 7;
  target.setDate(now.getDate() + diff);
  target.setHours(21, 0, 0, 0);
  return target;
}

export default function PromoLiveClass() {
  const [target] = useState(getNextFriday9pm());
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const dateStr = target.toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section className="py-16 md:py-20 px-4 bg-orange-50/40">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-[#2d1810] to-[#5b2a14] text-white p-8 md:p-12 shadow-2xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">
              <Radio className="h-3.5 w-3.5 animate-pulse" /> NEXT LIVE CLASS
            </span>
            <h3 className="mt-4 text-3xl md:text-4xl font-extrabold">
              Live Class on <span className="text-amber-400">Zoom</span>
            </h3>
            <p className="mt-2 text-white/70">{dateStr} — রাত ৯:০০ (BD Time)</p>

            <div className="mt-8 grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto">
              {[
                { v: time.d, l: "DAYS" },
                { v: time.h, l: "HOURS" },
                { v: time.m, l: "MINS" },
                { v: time.s, l: "SECS" },
              ].map((t, i) => (
                <div key={i} className="bg-black/30 backdrop-blur rounded-xl p-3 md:p-4 border border-white/10">
                  <div className="text-2xl md:text-4xl font-extrabold tabular-nums">{String(t.v).padStart(2, "0")}</div>
                  <div className="text-[10px] md:text-xs text-white/60 mt-1">{t.l}</div>
                </div>
              ))}
            </div>

            <a
              href="#order"
              className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary to-amber-400 text-primary-foreground font-bold shadow-xl hover:scale-[1.02] transition-transform"
            >
              Reserve My Seat <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
