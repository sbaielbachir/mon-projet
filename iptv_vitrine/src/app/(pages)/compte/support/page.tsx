'use client';
import React from 'react';
// CORRECTION : Le chemin pointe maintenant vers le bon dossier "account" et le bon nom de fichier
import SupportTicketsPage from '@/components/account/SupportTicketsPage';
import { useAuth } from '@/contexts/AuthContext';

export default function SupportPage() {
    const { user } = useAuth();
    if (!user) return null;
    return <SupportTicketsPage clientName={user.user.first_name || ''} />;
}