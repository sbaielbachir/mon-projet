import { Tv, Zap, ShieldCheck, Clapperboard, LifeBuoy, Gem } from 'lucide-react';

const featuresList = [
    { icon: Tv, title: "Qualité 4K & FHD", description: "Une image ultra-haute définition pour une immersion totale." },
    { icon: Zap, title: "Technologie Anti-Freeze", description: "Nos serveurs puissants garantissent une stabilité à 99.9%." },
    { icon: Clapperboard, title: "VOD Illimitée", description: "Des milliers de films et séries mis à jour régulièrement." },
    { icon: ShieldCheck, title: "Sécurité & Anonymat", description: "Votre connexion est sécurisée et votre vie privée respectée." },
    { icon: LifeBuoy, title: "Support Client 24/7", description: "Notre équipe est là pour vous aider à tout moment." },
    { icon: Gem, title: "Accès Premium", description: "Profitez de contenus exclusifs et d'un service de haute qualité." },
];

const Features = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold gradient-text animate-gradient-text">Pourquoi Choisir Fasty IPTV ?</h2>
                    <p className="text-text-muted mt-4 max-w-2xl mx-auto">Nous offrons bien plus que de la télévision. Nous offrons une expérience de divertissement complète, stable et de haute qualité.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresList.map((feature, index) => (
                        <div key={index} className="bg-card p-8 rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary mb-6">
                                <feature.icon className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-text-muted">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;