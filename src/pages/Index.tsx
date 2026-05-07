import NoorHeader from "@/components/noor/NoorHeader";
import NoorHero from "@/components/noor/NoorHero";
import NoorProblem from "@/components/noor/NoorProblem";
import NoorSolution from "@/components/noor/NoorSolution";
import NoorFeatures from "@/components/noor/NoorFeatures";
import NoorCourses from "@/components/noor/NoorCourses";
import NoorReviews from "@/components/noor/NoorReviews";
import NoorFinalCTA from "@/components/noor/NoorFinalCTA";
import NoorFooter from "@/components/noor/NoorFooter";
import FloatingActions from "@/components/noor/FloatingActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NoorHeader />
      <main>
        <NoorHero />
        <NoorProblem />
        <NoorSolution />
        <NoorFeatures />
        <NoorCourses />
        <NoorReviews />
        <NoorFinalCTA />
      </main>
      <NoorFooter />
      <FloatingActions />
    </div>
  );
};

export default Index;
