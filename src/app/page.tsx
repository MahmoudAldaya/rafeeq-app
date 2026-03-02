import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import FeaturedScholarships from "@/components/home/FeaturedScholarships";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="section-divider" />
      <StatsSection />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <FeaturedScholarships />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <CTASection />
    </>
  );
}
