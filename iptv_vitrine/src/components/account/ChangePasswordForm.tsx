'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { changePassword } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function ChangePasswordForm() {
    const { token } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            if (!token) throw new Error("Non authentifié");
            await changePassword(token, oldPassword, newPassword);
            setSuccess('Mot de passe changé avec succès !');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">Changer le mot de passe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-muted">Ancien mot de passe</label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-muted">Nouveau mot de passe</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-muted">Confirmer le nouveau mot de passe</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 px-4 btn-primary flex items-center justify-center">
                    {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                    Mettre à jour
                </button>
                {success && <p className="text-green-400 text-center mt-2">{success}</p>}
                {error && <p className="text-red-400 text-center mt-2">{error}</p>}
            </form>
        </div>
    );
}