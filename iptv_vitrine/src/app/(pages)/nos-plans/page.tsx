// Fichier : src/app/(pages)/nos-plans/page.tsx
// Description : Page des abonnements.
// MISE À JOUR : Ajout du Header et du Footer.

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

import { getProducts } from '@/lib/api';
import { Product, ProcessedPlan, FeatureItem } from '@/lib/types';
import PlansTabs from '@/components/plans/plans-tabs';
import TestEligibility from '@/components/home/test-eligibility';
import ChannelLogos from '@/components/home/channel-logos';
import Compatibility from '@/components/home/compatibility';
import PopularMoviesSection from '@/components/shared/popular-movies-section';

export const revalidate = 60;

const standardFeatures: FeatureItem[] = [
    { text: "Qualité Full HD 1080p", iconName: "Tv2" },
    { text: "Accès Standard", iconName: "Shield" },
    { text: "Support 7/7", iconName: "LifeBuoy" },
    { text: "+20,000 Chaînes & VOD", iconName: "Clapperboard" },
    { text: "Mises à jour quotidiennes", iconName: "RefreshCw" }
];

const premiumFeatures: FeatureItem[] = [
    { text: "Qualité 4K UHD", iconName: "Sparkles" },
    { text: "Accès Premium", iconName: "Gem" },
    { text: "Contenu Exclusif", iconName: "Star" },
    { text: "Multi-appareils (Option)", iconName: "Smartphone" },
    { text: "+20,000 Chaînes & VOD", iconName: "Clapperboard" },
    { text: "Mises à jour quotidiennes", iconName: "RefreshCw" }
];

const processProducts = (products: Product[]): { standard: ProcessedPlan[], premium: ProcessedPlan[] } => {
    const standard: ProcessedPlan[] = [];
    const premium: ProcessedPlan[] = [];

    products.forEach(product => {
        if (product && product.nom && product.prix) {
            const nameLower = product.nom.toLowerCase();
            let duration = '';
            if (nameLower.includes('12 mois')) duration = '12 Mois';
            else if (nameLower.includes('6 mois')) duration = '6 Mois';
            else if (nameLower.includes('3 mois')) duration = '3 Mois';

            const priceParts = product.prix.split('.');
            const price = priceParts[0];

            const plan: ProcessedPlan = {
                id: product.id,
                duration,
                price,
                currency: 'C$',
                features: nameLower.includes('standard') ? standardFeatures : premiumFeatures,
                isHighlighted: nameLower.includes('standard') && nameLower.includes('12 mois'),
            };

            if (nameLower.includes('standard')) {
                standard.push(plan);
            } else if (nameLower.includes('premium')) {
                plan.isHighlighted = nameLower.includes('12 mois');
                premium.push(plan);
            }
        }
    });

    const sortLogic = (a: ProcessedPlan, b: ProcessedPlan) => parseInt(a.duration) - parseInt(b.duration);
    standard.sort(sortLogic);
    premium.sort(sortLogic);

    return { standard, premium };
};


export default async function PlansPage() {
  const products = await getProducts();
  const processedPlans = processProducts(products);

  return (
    // On utilise un Fragment (<>) pour retourner plusieurs éléments
    <>
      <Header />
      <main>
        <div className="pt-40">
          <div className="container mx-auto px-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text animate-gradient-text">Nos Abonnements</h1>
            <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">Choisissez le plan qui vous convient le mieux pour une expérience de divertissement inégalée.</p>
            
            {products.length > 0 ? (
                <PlansTabs initialPlans={processedPlans} />
            ) : (
                <p className="text-center text-text-muted">Aucun plan d'abonnement n'est disponible pour le moment. Veuillez réessayer plus tard.</p>
            )}
          </div>
        </div>

        <TestEligibility />
        <ChannelLogos />
        <Compatibility />
        <PopularMoviesSection />
      </main>
      <Footer />
    </>
  );
}