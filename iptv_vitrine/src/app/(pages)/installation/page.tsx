// Fichier : src/app/(pages)/installation/page.tsx

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import InstallationGuide from "@/components/installation/installation-guide";

export default function InstallationPage() {
    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Guides d'Installation</h1>
                        <p className="text-text-muted mt-4 max-w-2xl mx-auto">Suivez nos tutoriels simples et détaillés pour configurer votre service IPTV sur n'importe quel appareil.</p>
                    </div>
                    <InstallationGuide />
                </div>
            </main>
            <Footer />
        </>
    );
}