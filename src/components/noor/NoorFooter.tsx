import { ShieldCheck } from "lucide-react";
import logo from "@/assets/noor-logo.png";

const methods = [
  { name: "bKash", color: "bg-pink-600" },
  { name: "Nagad", color: "bg-orange-500" },
  { name: "Rocket", color: "bg-purple-600" },
];

export default function NoorFooter() {
  return (
    <footer className="bg-white border-t border-border">
      {/* Payment band */}
      <div className="border-b border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold">পেমেন্ট মেথড</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            নিচের যেকোনো একটি মাধ্যমে পেমেন্ট করুন
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {methods.map((m) => (
              <div
                key={m.name}
                className={`${m.color} text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg`}
              >
                {m.name}
              </div>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            পেমেন্ট করলে সাথে সাথে access পাবেন
          </div>
        </div>
      </div>

      {/* Brand row */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Noor" className="h-9 w-auto" />
          <span className="font-extrabold">Noor Handicraft Academy</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Noor Handicraft Academy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
