'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientCommandes } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function CommandesPage() {
    const { token } = useAuth();
    const [commandes, setCommandes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCommandes = async () => {
            if (token) {
                try {
                    const data = await getClientCommandes(token);
                    setCommandes(data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des commandes", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchCommandes();
    }, [token]);
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Mes Commandes</h1>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                 {isLoading ? (
                    <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold">ID</th>
                                <th className="p-3 text-left text-sm font-semibold">Produit</th>
                                <th className="p-3 text-left text-sm font-semibold">Date</th>
                                <th className="p-3 text-left text-sm font-semibold">Montant</th>
                                <th className="p-3 text-left text-sm font-semibold">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.length > 0 ? (
                                commandes.map(order => (
                                    <tr key={order.id} className="border-t border-border">
                                        <td className="p-3">#{order.id}</td>
                                        <td className="p-3">{order.produit.nom}</td>
                                        <td className="p-3">{new Date(order.date_commande).toLocaleDateString('fr-FR')}</td>
                                        <td className="p-3">{parseFloat(order.montant).toFixed(2)} C$</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${order.statut_paiement === 'paye' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {order.statut_paiement}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-text-muted">Aucune commande trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}