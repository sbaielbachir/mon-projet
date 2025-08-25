// Fichier : src/app/(pages)/page.tsx
// Description : Page d'accueil.
// MISE À JOUR : Ajout manuel du Header et du Footer.

// Import du Header et du Footer
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

// ... (vos autres imports pour la page d'accueil)
import HeroSlider from "@/components/home/hero-slider";
import ChannelLogos from "@/components/home/channel-logos";
import Features from "@/components/home/features";
import Compatibility from "@/components/home/compatibility";
import FaqAccordion from "@/components/shared/faq-accordion";
import { FaqItem } from "@/lib/types";
import Link from "next/link";
import PopularMoviesSection from "@/components/shared/popular-movies-section";
import StatsCounter from "@/components/home/stats-counter";
import TestEligibility from "@/components/home/test-eligibility";

const homeFaqItems: FaqItem[] = [
    // ... (contenu des items faq)
];

export default function HomePage() {
  return (
    // On encadre le contenu de la page avec le Header et le Footer
    <>
      <Header />
      <main>
        <HeroSlider />
        <StatsCounter />
        <ChannelLogos />
        <Features />
        <PopularMoviesSection />
        <Compatibility />
        <TestEligibility />
        
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Questions Fréquentes</h2>
                  <p className="text-text-muted mt-4 max-w-2xl mx-auto">Trouvez rapidement les réponses à vos questions les plus courantes.</p>
              </div>
              <FaqAccordion items={homeFaqItems} />
              <div className="text-center mt-12">
                  <Link href="/faq" className="btn-secondary">
                      Voir toutes les questions
                  </Link>
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
