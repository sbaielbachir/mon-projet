'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
// CORRECTION : Le chemin pointe maintenant vers le bon dossier "account"
import ProfilePage from '@/components/account/ProfilePage';

export default function MonProfilPage() {
    const { user, checkSession } = useAuth();
    if (!user) return null; 
    return <ProfilePage clientData={user} onProfileUpdate={checkSession} />;
}
