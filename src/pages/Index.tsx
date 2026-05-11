import PromoHeader from "@/components/promo/PromoHeader";
import PromoHero from "@/components/promo/PromoHero";
import PromoProblem from "@/components/promo/PromoProblem";
import PromoSolution from "@/components/promo/PromoSolution";
import PromoModules from "@/components/promo/PromoModules";
import PromoFeatures from "@/components/promo/PromoFeatures";
import PromoBonuses from "@/components/promo/PromoBonuses";
import PromoTransformation from "@/components/promo/PromoTransformation";
import PromoAudience from "@/components/promo/PromoAudience";
import PromoPricing from "@/components/promo/PromoPricing";
import PromoFAQ from "@/components/promo/PromoFAQ";
import PromoFinalCTA from "@/components/promo/PromoFinalCTA";
import PromoFooter from "@/components/promo/PromoFooter";
import NoorReviews from "@/components/noor/NoorReviews";
import FloatingActions from "@/components/noor/FloatingActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PromoHeader />
      <main>
        <PromoHero />
        <PromoProblem />
        <PromoSolution />
        <PromoModules />
        <PromoFeatures />
        <PromoBonuses />
        <PromoTransformation />
        <PromoAudience />
        <PromoPricing />
        <NoorReviews />
        <PromoFAQ />
        <PromoFinalCTA />
      </main>
      <PromoFooter />
      <FloatingActions />
    </div>
  );
};

export default Index;
