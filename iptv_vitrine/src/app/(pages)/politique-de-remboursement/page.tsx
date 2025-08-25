import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const PolitiqueDeRemboursementPage = () => {
    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Politique de Remboursement</h1>
                        <p className="text-text-muted mt-4">Dernière mise à jour : 8 août 2025</p>
                    </div>
                    <div className="prose prose-invert prose-lg mx-auto text-text-muted space-y-6">
                        <p>Notre objectif est votre satisfaction. Voici notre politique concernant les remboursements.</p>
                        <h2 className="text-white">1. Conditions de Remboursement</h2>
                        <p>Un remboursement complet peut être demandé dans les 7 jours suivant l'achat si vous n'êtes pas satisfait du service. Passé ce délai de 7 jours, aucun remboursement ne sera effectué.</p>
                        <h2 className="text-white">2. Processus de Demande</h2>
                        <p>Pour demander un remboursement, veuillez contacter notre service client à contact@iptvfasty.com avec votre nom et l'adresse e-mail utilisée lors de l'achat. Nous traiterons votre demande dans un délai de 48 heures.</p>
                        <h2 className="text-white">3. Exceptions</h2>
                        <p>Aucun remboursement ne sera accordé si nous constatons une violation de nos termes et conditions, comme le partage de compte ou la revvente du service.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
export default PolitiqueDeRemboursementPage;