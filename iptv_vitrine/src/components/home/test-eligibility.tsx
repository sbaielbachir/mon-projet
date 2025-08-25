"use client";
import { useState } from 'react';
import { Wifi, Tv, Smartphone, XCircle, CheckCircle, Info } from 'lucide-react';

const TestEligibility = () => {
    const [device, setDevice] = useState('');
    const [speed, setSpeed] = useState(50);
    const [result, setResult] = useState<{ status: 'success' | 'info' | 'error', message: string, recommendation: string } | null>(null);

    const devices = ["Smart TV", "Boîtier Android", "Amazon Firestick", "Apple TV", "Smartphone (iOS & Android)", "Ordinateur"];

    const handleTest = () => {
        if (!device) {
            setResult({
                status: 'error',
                message: "Veuillez sélectionner un appareil.",
                recommendation: "Le choix d'un appareil est nécessaire pour compléter le test."
            });
            return;
        }

        let recommendation = `Avec votre ${device} et une connexion de ${speed} Mbps, notre service fonctionnera parfaitement.`;
        if (speed >= 50) {
            setResult({ status: 'success', message: "Félicitations ! Vous êtes éligible pour la 4K UHD.", recommendation: `${recommendation} Vous pourrez profiter de la meilleure qualité d'image disponible.` });
        } else if (speed >= 25) {
            setResult({ status: 'success', message: "Vous êtes éligible pour la Full HD.", recommendation: `${recommendation} Une excellente expérience visuelle vous attend.` });
        } else {
            setResult({ status: 'info', message: "Votre connexion est suffisante pour la qualité standard.", recommendation: `${recommendation} Pour une meilleure expérience, nous recommandons une connexion plus rapide.` });
        }
    };

    const ResultMessage = () => {
        if (!result) return null;

        const baseClasses = "p-4 rounded-lg mt-6 text-left flex items-start gap-4";
        const statusClasses = {
            success: "bg-green-500/10 text-green-400 border border-green-500/20",
            info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
            error: "bg-red-500/10 text-red-400 border border-red-500/20",
        };
        const Icon = {
            success: CheckCircle,
            info: Info,
            error: XCircle
        }[result.status];

        return (
            <div className={`${baseClasses} ${statusClasses[result.status]}`}>
                <Icon className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold">{result.message}</h4>
                    <p className="text-sm">{result.recommendation}</p>
                </div>
            </div>
        );
    };

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Testez Votre Éligibilité</h2>
                <p className="text-text-muted mt-4 max-w-2xl mx-auto">Vérifiez en quelques secondes si votre équipement est compatible avec notre service IPTV.</p>
                <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border mt-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="w-full space-y-4">
                            <div>
                                <label htmlFor="device" className="flex items-center gap-2 text-text-muted mb-2 text-left"><Smartphone size={16} /> Quel appareil utilisez-vous ?</label>
                                <select id="device" value={device} onChange={(e) => setDevice(e.target.value)} className="w-full bg-background border border-border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="">Sélectionnez un appareil</option>
                                    {devices.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="speed" className="flex items-center gap-2 text-text-muted mb-2 text-left"><Wifi size={16} /> Quelle est votre vitesse internet ?</label>
                                <input type="range" id="speed" min="5" max="200" step="5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer range-thumb:bg-primary" />
                                <div className="text-primary font-bold mt-2">{speed} Mbps</div>
                            </div>
                        </div>
                        <div className="w-full">
                             <button onClick={handleTest} className="btn-primary w-full py-4 text-lg">
                                Lancer le test
                            </button>
                        </div>
                    </div>
                    <ResultMessage />
                </div>
            </div>
        </section>
    );
};

export default TestEligibility;