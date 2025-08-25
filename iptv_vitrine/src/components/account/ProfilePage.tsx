'use client';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import ChangePasswordForm from './ChangePasswordForm';

export default function ProfilePage({ clientData, onProfileUpdate }: { clientData: any, onProfileUpdate: () => void }) {
    const { token } = useAuth();
    
    const [formData, setFormData] = useState({
        first_name: clientData.user.first_name || '',
        last_name: clientData.user.last_name || '',
        telephone: clientData.telephone || '',
        adresse: clientData.adresse || '',
        ville: clientData.ville || '',
        code_postal: clientData.code_postal || '',
        pays: clientData.pays || 'Canada',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!token) throw new Error("Non authentifié");
            const payload = { user: { first_name: formData.first_name, last_name: formData.last_name }, telephone: formData.telephone, adresse: formData.adresse, ville: formData.ville, code_postal: formData.code_postal, pays: formData.pays };
            const response = await fetch('http://127.0.0.1:8000/api/client/me/', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'La mise à jour a échoué.');
            setSuccess('Profil mis à jour avec succès !');
            onProfileUpdate();
        } catch (err: any) {
            setError(err.message || 'La mise à jour a échoué.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Mon Profil</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-lg border border-border">
                    <h2 className="text-2xl font-semibold mb-4">Mes Informations</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-muted">Email</label>
                            <input type="email" id="email" value={clientData.user.email || ''} disabled className="w-full mt-1 px-3 py-2 bg-background border-border rounded-md cursor-not-allowed"/>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-text-muted">Prénom</label>
                                <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-text-muted">Nom</label>
                                <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-sm font-medium text-text-muted">Téléphone</label>
                            <input type="tel" name="telephone" id="telephone" value={formData.telephone} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                        </div>
                        {/* Champs d'adresse ajoutés */}
                        <div>
                            <label htmlFor="adresse" className="block text-sm font-medium text-text-muted">Adresse</label>
                            <input type="text" name="adresse" id="adresse" value={formData.adresse} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="ville" className="block text-sm font-medium text-text-muted">Ville</label>
                                <input type="text" name="ville" id="ville" value={formData.ville} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                            </div>
                            <div>
                                <label htmlFor="code_postal" className="block text-sm font-medium text-text-muted">Code Postal</label>
                                <input type="text" name="code_postal" id="code_postal" value={formData.code_postal} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="pays" className="block text-sm font-medium text-text-muted">Pays</label>
                            <select name="pays" id="pays" value={formData.pays} onChange={handleChange} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md">
                                <option>Canada</option>
                                <option>États-Unis</option>
                                <option>France</option>
                                <option>Maroc</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 px-4 btn-primary flex items-center justify-center">
                            {loading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                            Enregistrer
                        </button>
                        {success && <p className="text-green-400 text-center mt-2">{success}</p>}
                        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
                    </form>
                </div>
                <ChangePasswordForm />
            </div>
        </div>
    );
}