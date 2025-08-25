import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

const AvisDeNonResponsabilitePage = () => {
    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Avis de Non-Responsabilité</h1>
                        <p className="text-text-muted mt-4">Dernière mise à jour : 8 août 2025</p>
                    </div>
                    <div className="prose prose-invert prose-lg mx-auto text-text-muted space-y-6">
                        <p>IPTV Fasty est un fournisseur d'accès à des flux IPTV. Nous ne sommes pas propriétaires et n'hébergeons aucun des contenus diffusés sur nos serveurs.</p>
                        <p>Le contenu est fourni par des tiers et nous n'avons aucun contrôle sur celui-ci. Nous ne sommes pas responsables de l'exactitude, de la légalité ou de la nature du contenu accessible via notre service.</p>
                        <p>L'utilisation de notre service est à la seule discrétion et au risque de l'utilisateur. Il est de la responsabilité de l'utilisateur de s'assurer qu'il respecte les lois sur le droit d'auteur en vigueur dans son pays de résidence. L'utilisation d'un VPN est fortement recommandée pour protéger votre vie privée.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
export default AvisDeNonResponsabilitePage;