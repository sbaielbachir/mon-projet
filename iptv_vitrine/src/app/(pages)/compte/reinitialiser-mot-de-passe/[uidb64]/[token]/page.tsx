'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    const { uidb64, token } = params;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (password !== password2) {
            setError('Les mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/password-reset/confirm/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uidb64,
                    token,
                    new_password1: password,
                    new_password2: password2,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.token || data.uidb64 || 'Le lien est invalide ou a expiré.');
            }
            
            setMessage('Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion.');
            setTimeout(() => {
                router.push('/compte/connexion'); // Assurez-vous que cette route existe
            }, 3000);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Réinitialiser votre mot de passe</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Nouveau mot de passe
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="password2" className="block text-sm font-medium text-gray-300">
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            required
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !!message}
                        className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
                {message && <p className="text-center text-green-400">{message}</p>}
                {error && <p className="text-center text-red-400">{error}</p>}
            </div>
        </div>
    );
}