'use client';

import type { User } from '@/types/user';
import { signIn as apiSignIn, signOut as apiSignOut, getMe, tokenStore, API_BASE } from '@/lib/api';
import axios from 'axios';

export class AuthClient {
  async signIn(params: { email: string; password: string }): Promise<{ error?: string }> {
    try {
      await apiSignIn(params.email, params.password);
      return {};
    } catch (e: any) {
      return { error: 'Email ou mot de passe incorrect.' };
    }
  }

  // --- VERSION FINALE ET CORRIGÉE ---
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      if (!tokenStore.access) return { data: null };
      
      const responseData = await getMe();
      if (!responseData) return { data: null };

      if (!responseData.user.is_staff) {
        return { error: "Accès non autorisé." };
      }

      // Construction de l'objet User avec toutes les informations, y compris l'URL de l'avatar
      const user: User = {
        id: responseData.id?.toString(),
        avatar: responseData.avatar, // Récupération de l'URL complète de l'avatar
        email: responseData.user.email,
        firstName: responseData.user.first_name,
        lastName: responseData.user.last_name,
        is_staff: responseData.user.is_staff,
        telephone: responseData.telephone,
        city: responseData.ville,
      };

      return { data: user };
    } catch (e) {
      tokenStore.access = null;
      tokenStore.refresh = null;
      return { data: null, error: "Session invalide ou expirée." };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    apiSignOut();
    return {};
  }

  async resetPassword(params: { email: string }): Promise<{ error?: string }> {
    try {
      await axios.post(`${API_BASE}/password-reset/`, { email: params.email });
      return {};
    } catch (error: any) {
      console.error("Reset password error (client-side):", error);
      return {};
    }
  }
  
  async signUp(params: { firstName: string; lastName: string; email: string; password: string }): Promise<{ error?: string }> {
    console.log(params);
    return { error: "La fonctionnalité d'inscription n'est pas encore disponible." };
  }
}

export const authClient = new AuthClient();