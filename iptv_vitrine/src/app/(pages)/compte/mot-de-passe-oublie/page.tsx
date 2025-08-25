'use client';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Assurez-vous d'avoir lucide-react installé

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/password-reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // On ne se soucie pas de la réponse exacte pour des raisons de sécurité.
            // On affiche toujours le même message pour ne pas révéler si un email existe ou non.
            setMessage('Si un compte correspondant à cet e-mail existe, un lien pour réinitialiser le mot de passe a été envoyé.');

        } catch (err) {
            // En cas d'erreur réseau, on peut afficher un message plus générique
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Mot de passe oublié</h1>
                
                {message ? (
                    <div className="text-center">
                        <p className="text-green-400">{message}</p>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-gray-400">
                            Entrez votre adresse e-mail. Nous enverrons les instructions à cette adresse si elle est associée à un compte.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Adresse e-mail
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center"
                            >
                                {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                                {loading ? 'Envoi...' : 'Envoyer le lien'}
                            </button>
                        </form>
                    </>
                )}
                {error && <p className="text-center text-red-400 mt-4">{error}</p>}
            </div>
        </div>
    );
}