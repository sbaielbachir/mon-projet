'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientAffilieData, getClientAffiliateHistory } from '@/lib/api';
import { Loader2, AlertCircle, Copy, Gift, Percent } from 'lucide-react';
import { AffiliateApplicationModal } from '@/components/account/AffiliateApplicationModal';

interface CommissionHistoryItem {
    id: number;
    date_commande: string;
    client: { user: { username: string } };
    montant: string;
    montant_commission: string;
}

export default function AffiliesPage() {
    const { token, logout } = useAuth();
    const [affilieData, setAffilieData] = useState<any>(null);
    const [history, setHistory] = useState<CommissionHistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await getClientAffilieData(token);
            setAffilieData(data);
            const historyData = await getClientAffiliateHistory(token);
            setHistory(historyData);
        } catch (err: any) {
            if (err.message && err.message.toLowerCase().includes('aucune information')) {
                setError("Vous n'êtes pas encore affilié.");
            } else {
                setError(err.message || "Une erreur est survenue.");
                if (err.message?.includes("Session expirée")) logout();
            }
        } finally {
            setLoading(false);
        }
    }, [token, logout]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="flex justify-center items-center p-8 h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error && error.includes("pas encore affilié")) {
        return (
            <>
                <AffiliateApplicationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <div>
                    <h1 className="text-3xl font-bold text-white mb-6">Devenez Affilié</h1>
                    <div className="bg-card p-8 rounded-lg border border-border text-center">
                        <Gift size={48} className="mx-auto text-primary mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Rejoignez notre programme d'affiliation !</h2>
                        <p className="text-text-muted max-w-lg mx-auto">
                            Partagez votre amour pour notre service et soyez récompensé. Soumettez votre candidature pour activer votre compte affilié et commencer à gagner des commissions.
                        </p>
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-6">
                            Soumettre ma candidature
                        </button>
                    </div>
                </div>
            </>
        );
    }
    
    if (error) {
        return <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-2"><AlertCircle size={20} /> {error}</div>
    }

    if (!affilieData) {
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Mon Espace Affilié</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-2">Votre Code d'Affiliation</h2>
                    <p className="text-text-muted mb-2 text-sm">Partagez ce code avec vos amis. Ils obtiennent une réduction et vous gagnez une commission !</p>
                    <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                        <Percent size={16} />
                        <span>Commission de {parseFloat(affilieData.pourcentage_commission).toFixed(2)}% sur chaque vente</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background p-3 rounded-lg">
                        <input type="text" readOnly value={affilieData.code_affiliation} className="w-full bg-transparent text-lg font-mono truncate outline-none" />
                        <button onClick={() => handleCopy(affilieData.code_affiliation)} className="p-2 bg-primary/20 rounded hover:bg-primary/40 transition-colors">
                            <Copy size={16} />
                        </button>
                    </div>
                    {copied && <p className="text-xs text-green-400 mt-2 text-right">Code copié !</p>}
                </div>
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-4">Votre Solde</h2>
                    <p className="text-5xl font-bold text-green-400">{parseFloat(affilieData.solde_commission).toFixed(2)} $</p>
                    <p className="text-text-muted mt-2 text-sm">Le solde de vos commissions sera versé selon les termes convenus.</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Historique des Commissions</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Client Référé</th>
                                <th className="p-4">Montant Commande</th>
                                <th className="p-4">Commission Gagnée</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map(item => (
                                <tr key={item.id} className="border-t border-border">
                                    <td className="p-4">{new Date(item.date_commande).toLocaleDateString()}</td>
                                    <td className="p-4">{item.client.user.username}</td>
                                    <td className="p-4">{parseFloat(item.montant).toFixed(2)} $</td>
                                    <td className="p-4 text-green-400 font-semibold">+{parseFloat(item.montant_commission).toFixed(2)} $</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-text-muted">Aucune commission enregistrée pour le moment.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}