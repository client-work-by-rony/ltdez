import { ShieldCheck } from "lucide-react";

const methods = [
  { name: "bKash", color: "bg-pink-600" },
  { name: "Nagad", color: "bg-orange-500" },
  { name: "Rocket", color: "bg-purple-600" },
];

export default function NoorPayment() {
  return (
    <section id="payment" className="py-14 px-4 bg-secondary/40">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">পেমেন্ট মেথড</h2>
        <p className="mt-2 text-muted-foreground">নিচের যেকোনো একটি মাধ্যমে পেমেন্ট করুন</p>

        <div className="mt-7 flex flex-wrap justify-center gap-4">
          {methods.map((m) => (
            <div
              key={m.name}
              className={`${m.color} text-white px-7 py-3 rounded-xl font-bold text-base shadow-lg`}
            >
              {m.name}
            </div>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Payment করলে সাথে সাথে access পাবেন
        </div>
      </div>
    </section>
  );
}
