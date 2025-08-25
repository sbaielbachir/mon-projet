// Fichier : iptv_vitrine/src/app/(pages)/faq/page.tsx

import { FaqItemClient } from '@/components/FaqItemClient';
import Header from "@/components/shared/header"; // Ajout du Header
import Footer from "@/components/shared/footer"; // Ajout du Footer

// Définir le type pour nos objets FAQ, correspondant à notre modèle Django
interface Faq {
  id: number;
  question: string;
  reponse: string; // IMPORTANT: Ce nom doit correspondre exactement au champ dans votre Serializer
}

// Fonction pour récupérer les données depuis l'API Django
async function getFaqs(): Promise<Faq[]> {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/faqs/', {
      cache: 'no-cache',
    });
    if (!res.ok) {
      throw new Error(`Échec de la récupération des FAQs. Statut: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Erreur lors de la récupération via API:', error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    // Utilisation d'un Fragment <> pour inclure Header, main, et Footer
    <>
      <Header />
      {/* Structure principale de la page, reprenant le padding de l'ancien design */}
      <main className="pt-40 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Titre avec le style gradient de l'ancien design */}
            <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">
              Foire Aux Questions
            </h1>
            {/* Sous-titre avec le style de l'ancien design */}
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Nous avons rassemblé ici les réponses aux questions que vous vous posez le plus souvent.
            </p>
          </div>

          {/* La liste des questions/réponses venant de l'API */}
          <div className="space-y-4">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <FaqItemClient
                  key={faq.id}
                  question={faq.question}
                  answer={faq.reponse}
                />
              ))
            ) : (
              <p className="text-center text-gray-400 pt-8">
                Aucune question n'a été ajoutée pour le moment.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
