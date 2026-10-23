import { Hero } from "@/components/Hero";
import { TaxSection, InheritSection, AssetSection } from "@/components/Services";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { LatestPosts } from "@/components/LatestPosts";
import { PressSection } from "@/components/PressSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TaxSection />
      <InheritSection />
      <AssetSection />
      <About />
      <PressSection />
      <LatestPosts />
      <Contact />
    </>
  );
}
