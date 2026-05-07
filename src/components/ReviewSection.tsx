import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import review1 from "@/assets/review-1.jpg";
import review2 from "@/assets/review-2.jpg";
import review3 from "@/assets/review-3.jpg";

const reviews = [review1, review2, review3];

const ReviewSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="reviews" className="py-16 md:py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-muted-foreground max-w-xl mx-auto text-base font-bold md:text-4xl">
            আমাদের মেম্বারদের অভিজ্ঞতা তাদের নিজের ভাষায়
          </p>
        </motion.div>

        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={reviews[current]}
              alt={`Review ${current + 1}`}
              className="w-full h-auto object-contain"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary scale-110" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
