"use client";
import { useState } from 'react';
import { Product, OrderPayload } from '@/lib/types';
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface OrderFormProps {
    product: Product;
}

const OrderForm = ({ product }: OrderFormProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        client_name: '',
        client_lastname: '',
        client_email: '',
        client_phone: '',
        client_address: '',
        client_city: '',
        client_postal_code: '',
        client_country: 'Canada', // Valeur par défaut
        affiliate_code: '',
    });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Création de la commande...');
        try {
            const orderData: OrderPayload = {
                ...formData,
                product_id: product.id,
            };
            await createOrder(orderData);
            setStatus('Commande créée avec succès ! Vous allez être redirigé.');
            router.push('/merci');
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue.';
            setStatus(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Informations de facturation</h3>
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="client_name" className="block text-sm font-medium text-text-muted mb-1">Prénom</label>
                    <input type="text" name="client_name" id="client_name" required value={formData.client_name} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="client_lastname" className="block text-sm font-medium text-text-muted mb-1">Nom</label>
                    <input type="text" name="client_lastname" id="client_lastname" required value={formData.client_lastname} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
                </div>
            </div>
             <div>
                <label htmlFor="client_email" className="block text-sm font-medium text-text-muted mb-1">Adresse e-mail</label>
                <input type="email" name="client_email" id="client_email" required value={formData.client_email} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
            </div>
            <div>
                <label htmlFor="client_phone" className="block text-sm font-medium text-text-muted mb-1">Numéro de téléphone</label>
                <input type="tel" name="client_phone" id="client_phone" required value={formData.client_phone} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
            </div>
            <div>
                <label htmlFor="client_address" className="block text-sm font-medium text-text-muted mb-1">Adresse</label>
                <input type="text" name="client_address" id="client_address" required value={formData.client_address} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="client_city" className="block text-sm font-medium text-text-muted mb-1">Ville</label>
                    <input type="text" name="client_city" id="client_city" required value={formData.client_city} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="client_postal_code" className="block text-sm font-medium text-text-muted mb-1">Code Postal</label>
                    <input type="text" name="client_postal_code" id="client_postal_code" required value={formData.client_postal_code} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
                </div>
            </div>
             <div>
                <label htmlFor="client_country" className="block text-sm font-medium text-text-muted mb-1">Pays</label>
                <select name="client_country" id="client_country" value={formData.client_country} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading}>
                    <option>Canada</option>
                    <option>États-Unis</option>
                    <option>France</option>
                    <option>Maroc</option>
                    {/* Ajoutez d'autres pays au besoin */}
                </select>
            </div>
             <div className="border-t border-border pt-6">
                <label htmlFor="affiliate_code" className="block text-sm font-medium text-text-muted mb-1">Code promotionnel (facultatif)</label>
                <input type="text" name="affiliate_code" id="affiliate_code" value={formData.affiliate_code} onChange={handleChange} className="w-full bg-white/5 border-border rounded-md p-3 focus:ring-primary focus:border-primary" disabled={isLoading} />
            </div>
            <div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center text-lg py-4" disabled={isLoading}>
                    {isLoading && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                    {isLoading ? 'Traitement en cours...' : 'Passer la commande'}
                </button>
            </div>
            {status && <p className={`text-center mt-4 ${status.includes('erreur') || status.includes('échoué') ? 'text-red-400' : 'text-green-400'}`}>{status}</p>}
        </form>
    );
};

export default OrderForm;