// Fichier : src/app/(pages)/contact/page.tsx
"use client";

import { useState } from 'react';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Envoi en cours...');
        // Simulation d'un appel API
        console.log("Données du formulaire (simulation):", formData);
        
        setTimeout(() => {
            setStatus('Votre message a bien été envoyé ! Nous vous répondrons rapidement.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    return (
        <>
            <Header />
            <main className="pt-40 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold gradient-text animate-gradient-text">Contactez-nous</h1>
                        <p className="text-text-muted mt-4 max-w-2xl mx-auto">Une question ? Une suggestion ? N'hésitez pas à nous contacter. Notre équipe est à votre écoute.</p>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="bg-card p-8 rounded-lg border border-border">
                            <h2 className="text-2xl font-bold mb-6">Envoyer un message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-1">Nom</label>
                                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Email</label>
                                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-1">Sujet</label>
                                    <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-1">Message</label>
                                    <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="btn-primary w-full">Envoyer</button>
                                </div>
                                {status && <p className="text-center mt-4">{status}</p>}
                            </form>
                        </div>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-4 rounded-full"><Mail className="text-primary" size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-bold">Email</h3>
                                    <p className="text-text-muted">Envoyez-nous un email pour toute demande.</p>
                                    <a href="mailto:contact@iptvfasty.com" className="text-primary hover:underline">contact@iptvfasty.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-4 rounded-full"><Phone className="text-primary" size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-bold">Téléphone</h3>
                                    <p className="text-text-muted">Contactez notre support pour une aide directe.</p>
                                    <a href="tel:514-473-4752" className="text-primary">514-473-4752</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-4 rounded-full"><MapPin className="text-primary" size={24} /></div>
                                <div>
                                    <h3 className="text-xl font-bold">Adresse</h3>
                                    <p className="text-text-muted">Laval, Québec, Canada</p>
                                    <p className="text-text-muted text-sm">(Visites sur rendez-vous uniquement)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}