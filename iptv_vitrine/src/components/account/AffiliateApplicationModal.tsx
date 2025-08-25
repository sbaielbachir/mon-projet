'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitAffiliationRequest } from '@/lib/api';
import { Loader2, X } from 'lucide-react';

interface AffiliateApplicationModalProps {
    open: boolean;
    onClose: () => void;
}

// CORRECTION: L'export est maintenant un "export default" pour la cohérence
export default function AffiliateApplicationModal({ open, onClose }: AffiliateApplicationModalProps) {
    const { token } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError("Vous n'êtes pas connecté.");
            return;
        }
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await submitAffiliationRequest(token, message);
            setSuccess('Votre demande a été envoyée avec succès ! Nous vous répondrons bientôt.');
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 3000);
        } catch (err: any) {
            setError(err.message || "L'envoi de la demande a échoué.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-white">
                    <X size={20} />
                </button>
                <h3 className="text-xl font-bold text-center mb-4">Demande d'Affiliation</h3>
                
                {success ? (
                    <div className="text-center py-8">
                        <p className="text-green-400">{success}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="message" className="block text-sm text-text-muted mb-1">Votre message (Optionnel)</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                placeholder="Expliquez brièvement pourquoi vous souhaitez devenir affilié..."
                                className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center">
                            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Envoyer ma demande
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};