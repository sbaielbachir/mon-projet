'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginPopoverProps {
    anchorEl: HTMLElement | null;
    open: boolean;
    onClose: () => void;
}

export const LoginPopover = ({ open, onClose }: LoginPopoverProps) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            onClose(); // Ferme le popover en cas de succès
        } catch (err: any) {
            setError(err.message || "La connexion a échoué.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-card border border-border rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-center mb-4">Connexion</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-text-muted">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm text-text-muted">Mot de passe</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full btn-primary flex items-center justify-center">
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Se connecter
                    </button>
                    <div className="text-center text-sm">
                        <Link href="/compte/mot-de-passe-oublie" className="text-primary hover:underline">Mot de passe oublié ?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};