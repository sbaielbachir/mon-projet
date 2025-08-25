// Fichier : src/app/(pages)/merci/page.tsx

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { PartyPopper } from 'lucide-react';
import Link from "next/link";

export default function MerciPage() {
  return (
    <>
        <Header />
        <main className="min-h-screen flex items-center justify-center text-center">
            <div className="max-w-3xl mx-auto py-16 px-4">
              <PartyPopper className="mx-auto h-16 w-16 text-secondary" />
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl gradient-text animate-gradient-text">
                Merci pour votre commande !
              </h1>
              <p className="mt-4 text-lg text-text-muted">
                Votre commande a bien été enregistrée avec le statut "En attente de paiement".
              </p>
              <div className="mt-8 bg-card p-6 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold text-primary">Prochaines étapes</h2>
                <p className="mt-2 text-text-muted">
                  Nous allons vous contacter très prochainement par e-mail avec les instructions pour finaliser le paiement et activer votre abonnement.
                  Veuillez vérifier votre boîte de réception ainsi que votre dossier de courriers indésirables.
                </p>
              </div>
              <div className="mt-10">
                <Link href="/" className="btn-primary">
                    Retour à l'accueil
                </Link>
              </div>
            </div>
        </main>
        <Footer />
    </>
  );
}