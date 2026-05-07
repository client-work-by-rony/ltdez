import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-banner.jpg";
import heroOverlay from "@/assets/hero-overlay.png";

const HeroSection = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from('hero_slides')
        .select('image_url')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (data && data.length > 0) {
        setSlides(data.map(s => s.image_url));
      }
    };
    fetchSlides();
  }, []);

  const imageList = slides.length > 0 ? slides : [heroImage];

  useEffect(() => {
    if (imageList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageList.length]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Hero Image Slider */}
      <div className="relative w-full max-w-7xl mx-auto mt-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={imageList[currentIndex]}
            alt="Believers' Dreams Hero Banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-auto object-contain rounded-lg shadow-2xl"
          />
        </AnimatePresence>

        {/* Dots indicator */}
        {imageList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {imageList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-primary' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Animated Overlay Image */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[2%] left-[2%] w-[20%]"
        >
          <img
            src={heroOverlay}
            alt="স্বপ্ন পূরণ করুন পরিকল্পনার সাথে"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground"
      >
        🌟 Discipline | Clarity | Daily Action
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-4 flex flex-col sm:flex-row gap-4"
      >
        <Button
          size="lg"
          className="text-lg px-8 py-6 bg-hero-gradient hover:opacity-90 shadow-glow font-semibold"
          asChild
        >
          <Link to="/auth">👉 এখনই প্রোগ্রামে যোগ দিন</Link>
        </Button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
