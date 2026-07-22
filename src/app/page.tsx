import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Systems from "@/components/sections/Systems";
import ArsenalShowcase from "@/components/sections/ArsenalShowcase";
import FlightLog from "@/components/sections/FlightLog";
import Diagnostics from "@/components/sections/Diagnostics";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="bg-background">
      <Navbar />
      <Hero />
      <Systems />
      <ArsenalShowcase />
      <FlightLog />
      <Diagnostics />
      <FinalCta />
      <Footer />
    </main>
  );
}
