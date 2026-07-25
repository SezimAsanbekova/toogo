import Header from "./components/Header";
import Hero from "./components/Hero";
import PopularLocations from "./components/PopularLocations";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import PartnerBanner from "./components/PartnerBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <PopularLocations />
        <Services />
        <PartnerBanner />
      </main>
      <Footer />
    </>
  );
}
