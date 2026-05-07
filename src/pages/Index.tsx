import PromoHeader from "@/components/promo/PromoHeader";
import PromoHero from "@/components/promo/PromoHero";
import PromoProblem from "@/components/promo/PromoProblem";
import PromoSolution from "@/components/promo/PromoSolution";
import PromoFeatures from "@/components/promo/PromoFeatures";
import PromoTransformation from "@/components/promo/PromoTransformation";
import PromoAudience from "@/components/promo/PromoAudience";
import PromoLiveClass from "@/components/promo/PromoLiveClass";
import PromoPricing from "@/components/promo/PromoPricing";
import PromoOrderForm from "@/components/promo/PromoOrderForm";
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
        <PromoFeatures />
        <PromoTransformation />
        <PromoAudience />
        
        <PromoPricing />
        <PromoOrderForm />
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
