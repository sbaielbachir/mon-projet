export interface Product {
  id: number;
  nom: string;
  description?: string;
  prix: string;
  duree_jours: number;
}

export interface FeatureItem {
  text: string;
  iconName: string;
}

export interface ProcessedPlan {
    id: number;
    duration: string;
    price: string;
    currency: string;
    features: FeatureItem[];
    isHighlighted: boolean;
}

// Mise à jour de l'interface OrderPayload
export interface OrderPayload {
  client_name: string;
  client_lastname: string;
  client_email: string;
  client_phone: string;
  client_address: string; // Nouveau
  client_city: string; // Nouveau
  client_postal_code: string; // Nouveau
  client_country: string; // Nouveau
  product_id: number;
  affiliate_code?: string; // Nouveau et optionnel
}

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}