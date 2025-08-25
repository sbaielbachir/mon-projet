import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const PolitiqueDeConfidentialitePage = () => {
    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Politique de Confidentialité</h1>
                        <p className="text-text-muted mt-4">Dernière mise à jour : 8 août 2025</p>
                    </div>
                    <div className="prose prose-invert prose-lg mx-auto text-text-muted space-y-6">
                        <p>IPTV Fasty s'engage à protéger votre vie privée. Cette politique explique quelles informations nous collectons et comment nous les utilisons.</p>
                        <h2 className="text-white">1. Informations que nous collectons</h2>
                        <p>Nous collectons les informations que vous nous fournissez lors de la commande, telles que votre nom et votre adresse e-mail. Nous ne collectons aucune information de paiement, car celles-ci sont traitées par des prestataires de paiement tiers sécurisés.</p>
                        <h2 className="text-white">2. Utilisation de vos informations</h2>
                        <p>Vos informations sont utilisées pour :</p>
                        <ul>
                            <li>Créer et gérer votre compte.</li>
                            <li>Vous fournir l'accès au service IPTV.</li>
                            <li>Vous contacter concernant votre abonnement et le support client.</li>
                            <li>Vous informer des mises à jour ou des offres spéciales.</li>
                        </ul>
                        <h2 className="text-white">3. Partage des informations</h2>
                        <p>Nous ne vendons, ne louons et ne partageons jamais vos informations personnelles avec des tiers à des fins de marketing. Vos informations ne sont partagées qu'en cas de nécessité pour la fourniture du service ou si la loi l'exige.</p>
                        <h2 className="text-white">4. Sécurité</h2>
                        <p>Nous prenons des mesures de sécurité raisonnables pour protéger vos informations personnelles contre la perte, le vol et l'accès non autorisé. Cependant, aucune méthode de transmission sur Internet n'est sûre à 100%.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
export default PolitiqueDeConfidentialitePage;