import { Hero } from "@/components/Hero";
import { TaxSection, InheritSection, AssetSection } from "@/components/Services";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { LatestPosts } from "@/components/LatestPosts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TaxSection />
      <InheritSection />
      <AssetSection />
      <About />
      <LatestPosts />
      <Contact />
    </>
  );
}
