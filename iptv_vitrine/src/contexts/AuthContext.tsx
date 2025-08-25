'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as apiLogin, getClientData as apiGetClientData } from '@/lib/api';
import { Loader2 } from 'lucide-react';

// Définition des types pour plus de clarté
interface User {
    id: number;
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    telephone?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    pays?: string;
    // ... et d'autres champs si nécessaire
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkSession = useCallback(async (existingToken: string | null = null) => {
        const tokenToCheck = existingToken || localStorage.getItem('access_token');
        if (tokenToCheck) {
            try {
                const userData = await apiGetClientData(tokenToCheck);
                setToken(tokenToCheck);
                setUser(userData);
            } catch (error) {
                console.error("Session check failed, logging out.", error);
                localStorage.removeItem('access_token');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = async (email: string, pass: string) => {
        const tokenData = await apiLogin(email, pass);
        localStorage.setItem('access_token', tokenData.access);
        await checkSession(tokenData.access);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
    };

    const value = { token, user, isLoading, login, logout, checkSession };

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};