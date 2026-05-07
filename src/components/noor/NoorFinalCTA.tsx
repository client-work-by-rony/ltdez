import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NoorFinalCTA() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-foreground to-foreground/90 text-background rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
            আজই শুরু করুন <br />
            <span className="text-primary">আপনার নতুন জার্নি</span>
          </h2>
          <p className="mt-4 text-background/75 max-w-xl mx-auto">
            অপেক্ষা শেষ। আজ থেকেই শিখুন, কাল থেকেই ইনকাম শুরু করুন।
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 hover:scale-[1.03] transition-transform"
          >
            এখনই Enroll করুন <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
