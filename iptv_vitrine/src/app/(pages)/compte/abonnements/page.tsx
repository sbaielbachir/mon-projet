'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientAbonnements } from '@/lib/api';
import { Loader2, Tv, Calendar, CheckCircle, XCircle, Copy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AbonnementsPage() {
    const { token } = useAuth();
    const [abonnements, setAbonnements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleDetails, setVisibleDetails] = useState<number | null>(null);

    useEffect(() => {
        const fetchAbonnements = async () => {
            if (token) {
                try {
                    const data = await getClientAbonnements(token);
                    setAbonnements(data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des abonnements", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchAbonnements();
    }, [token]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Détails de connexion copiés !');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Mes Abonnements</h1>
            <div className="bg-card border border-border rounded-lg p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : abonnements.length > 0 ? (
                    <div className="space-y-4">
                        {abonnements.map(sub => (
                            <div key={sub.id} className="bg-background p-4 rounded-lg border border-border">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2"><Tv size={20} /> {sub.produit.nom}</h3>
                                        <p className="text-sm text-text-muted flex items-center gap-2 mt-1">
                                            <Calendar size={14} /> 
                                            Expire le: {new Date(sub.date_fin).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${sub.statut === 'actif' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {sub.statut === 'actif' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                        {sub.statut}
                                    </span>
                                </div>
                                {sub.statut === 'actif' && (
                                    <div className="mt-4 border-t border-border pt-4">
                                        <h4 className="text-sm font-semibold mb-2">Détails de connexion</h4>
                                        <div className="bg-black/20 p-3 rounded-md flex items-center justify-between gap-2">
                                            <pre className={`text-xs whitespace-pre-wrap ${visibleDetails === sub.id ? '' : 'blur-sm select-none'}`}>
                                                <code>{sub.details_connexion}</code>
                                            </pre>
                                            <div className="flex gap-2">
                                                <button onClick={() => setVisibleDetails(visibleDetails === sub.id ? null : sub.id)} className="p-2 hover:bg-white/10 rounded-md">
                                                    {visibleDetails === sub.id ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                <button onClick={() => handleCopy(sub.details_connexion)} className="p-2 hover:bg-white/10 rounded-md">
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-text-muted py-8">Vous n'avez aucun abonnement.</p>
                )}
            </div>
        </div>
    );
}