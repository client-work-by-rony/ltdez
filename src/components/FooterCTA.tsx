import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FooterCTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>

          <h2 className="text-3xl mb-4 md:text-3xl font-extrabold">
            আপনি যদি সত্যিই নিজের জীবন বদলাতে চান
          </h2>
          <p className="text-2xl text-primary font-semibold mb-8">
            আজই শুরু করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-10 py-6 bg-hero-gradient hover:opacity-90 shadow-glow font-semibold"
              asChild>

              <a href="#enroll"> Believers' Dreams-এ যোগ দিন</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6 font-semibold"
              asChild>

              <a href="#enroll">নিজের সেরা ভার্সন তৈরি করুন</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>);

};

export default FooterCTA;