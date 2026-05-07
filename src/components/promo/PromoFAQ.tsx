import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Beginner কি join করতে পারবেন?", a: "অবশ্যই। এই program সম্পূর্ণভাবে beginner-দের জন্য ডিজাইন করা। শূন্য থেকেই শুরু করতে পারবেন।" },
  { q: "Live class হবে কখন?", a: "প্রতি শুক্রবার রাত ৯টা–১০টা (BD Time), Zoom-এ। ভর্তির পর link পাবেন।" },
  { q: "Recording পাবো কি?", a: "হ্যাঁ, প্রতিটি live ক্লাসের recording lifetime access পাবেন।" },
  { q: "Payment কীভাবে করবো?", a: "bKash, Nagad, Rocket বা Card — যেকোনো একটিতে। Order করার পর WhatsApp-এ instruction পাবেন।" },
  { q: "Refund পাবো কি?", a: "৭ দিনের money-back guarantee — কোর্স পছন্দ না হলে পুরো টাকা ফেরত।" },
];

export default function PromoFAQ() {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold mb-12">
          Frequently Asked <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Questions</span>
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q-${i}`}
              className="bg-white border border-border rounded-2xl px-5 shadow-sm"
            >
              <AccordionTrigger className="text-left font-bold hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
