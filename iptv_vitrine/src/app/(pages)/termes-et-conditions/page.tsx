import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const TermesEtConditionsPage = () => {
    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Termes et Conditions</h1>
                        <p className="text-text-muted mt-4">Dernière mise à jour : 8 août 2025</p>
                    </div>
                    <div className="prose prose-invert prose-lg mx-auto text-text-muted space-y-6">
                        <p>Bienvenue sur IPTV Fasty. En accédant à notre site web et en utilisant nos services, vous acceptez d'être lié par les termes et conditions suivants. Veuillez les lire attentivement.</p>
                        <h2 className="text-white">1. Utilisation du Service</h2>
                        <p>Notre service est destiné à un usage personnel et non commercial. Vous ne devez pas revendre, distribuer ou diffuser notre service ou son contenu. L'âge minimum requis pour souscrire à nos services est de 18 ans.</p>
                        <h2 className="text-white">2. Contenu et Droits d'Auteur</h2>
                        <p>IPTV Fasty ne stocke, n'héberge et ne distribue aucun contenu vidéo. Nous fournissons un accès à des flux IPTV provenant de sources tierces. Il est de la responsabilité de l'utilisateur de s'assurer qu'il a le droit d'accéder au contenu diffusé.</p>
                        <h2 className="text-white">3. Paiement et Abonnements</h2>
                        <p>Les abonnements sont payables d'avance pour la période choisie (3, 6 ou 12 mois). Les paiements ne sont pas automatiquement renouvelés. Vous recevrez une notification avant l'expiration de votre abonnement.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
export default TermesEtConditionsPage;