import { Product, OrderPayload, TmdbMovie } from './types'; // Assurez-vous que ce fichier existe et contient les bons types

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// --- FONCTION D'AIDE GÉNÉRIQUE ---

const apiFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Construit un message d'erreur clair à partir de la réponse du backend
        const errorMessage = errorData.detail || Object.values(errorData).flat().join(' ') || `La requête a échoué avec le statut ${response.status}`;
        throw new Error(errorMessage);
    }
    // Gère les réponses sans contenu (ex: 204 No Content)
    if (response.status === 204) {
        return null;
    }
    return response.json();
};


// --- FONCTIONS PUBLIQUES (Pas besoin de token) ---

export async function getProducts(): Promise<Product[]> {
    return apiFetch(`${API_BASE_URL}/produits/`);
}

export async function getProductById(id: number): Promise<Product | null> {
    try {
        return await apiFetch(`${API_BASE_URL}/produits/${id}/`);
    } catch (error: any) {
        if (error.message.includes('404')) return null;
        throw error;
    }
}

export async function createOrder(orderData: OrderPayload): Promise<any> {
    const payload = {
        user: {
            email: orderData.client_email,
            first_name: orderData.client_name,
            last_name: orderData.client_lastname,
        },
        telephone: orderData.client_phone,
        adresse: orderData.client_address,
        ville: orderData.client_city,
        code_postal: orderData.client_postal_code,
        pays: orderData.client_country,
        product_id: orderData.product_id,
        code_affiliation: orderData.affiliate_code
    };
    return apiFetch(`${API_BASE_URL}/orders/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}

export async function getPopularMovies(): Promise<TmdbMovie[]> {
    if (!TMDB_API_KEY) {
        console.warn("TMDB API Key is not configured.");
        return [];
    }
    try {
        const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=1`);
        if (!response.ok) throw new Error('Failed to fetch popular movies');
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
}

// --- FONCTIONS PRIVÉES (Nécessitent un token) ---

const fetchWithAuth = (url: string, token: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
    return apiFetch(url, { ...options, headers });
};

// --- AUTHENTIFICATION (CORRIGÉ) ---
export const login = async (email: string, password: string) => {
    // CORRECTION : Le backend attend le champ "username", même si sa valeur est l'email.
    return apiFetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
    });
};

// --- DONNÉES CLIENT ---
export const getClientData = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/me/`, token);
};

export const updateClientData = async (token: string, payload: any) => {
    return fetchWithAuth(`${API_BASE_URL}/client/me/`, token, {
        method: 'PUT',
        body: JSON.stringify(payload),
    });
};

export const changePassword = async (token: string, old_password: string, new_password: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/change-password/`, token, {
        method: 'POST',
        body: JSON.stringify({ old_password, new_password }),
    });
};

// --- ABONNEMENTS & COMMANDES ---
export const getClientAbonnements = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/abonnements/`, token);
};

export const getClientCommandes = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/commandes/`, token);
};

// --- TICKETS DE SUPPORT ---
export const getClientTickets = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/tickets/`, token);
};

export const getTicketDetails = async (token: string, ticketId: number) => {
    return fetchWithAuth(`${API_BASE_URL}/tickets/${ticketId}/`, token);
};

export const createTicket = async (token: string, sujet: string, initial_message: string) => {
    return fetchWithAuth(`${API_BASE_URL}/tickets/`, token, {
        method: 'POST',
        body: JSON.stringify({ sujet, initial_message }),
    });
};

export const replyToTicket = async (token: string, ticketId: number, message: string) => {
    return fetchWithAuth(`${API_BASE_URL}/tickets/${ticketId}/reply/`, token, {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
};

export const closeTicket = async (token: string, ticketId: number) => {
    return fetchWithAuth(`${API_BASE_URL}/tickets/${ticketId}/close/`, token, { method: 'POST' });
};

// --- AFFILIATION ---
export const getClientAffilieData = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/affilie/`, token);
};

export const getClientAffiliateHistory = async (token: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/affilie/history/`, token);
};

export const submitAffiliationRequest = async (token: string, message: string) => {
    return fetchWithAuth(`${API_BASE_URL}/client/submit-affiliation/`, token, {
        method: 'POST',
        body: JSON.stringify({ message }),
    });
};