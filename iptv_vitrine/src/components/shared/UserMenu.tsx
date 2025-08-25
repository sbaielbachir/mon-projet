'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, User, Tv, ShoppingCart, MessageSquare, UserPlus, LogOut, ChevronDown } from 'lucide-react';

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, href: '/compte/dashboard' },
        { id: 'profil', label: 'Mon Profil', icon: User, href: '/compte/profil' },
        { id: 'abonnements', label: 'Abonnements', icon: Tv, href: '/compte/abonnements' },
        { id: 'commandes', label: 'Commandes', icon: ShoppingCart, href: '/compte/commandes' },
        { id: 'support', label: 'Support', icon: MessageSquare, href: '/compte/support' },
        { id: 'affilies', label: 'Affiliés', icon: UserPlus, href: '/compte/affilies' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-colors">
                <User size={16} />
                <span>{user?.user.first_name || 'Mon Compte'}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-xl py-2 animate-hero-fade-in-up">
                    <div className="px-4 py-2 border-b border-border">
                        <p className="font-bold truncate">{user?.user.first_name} {user?.user.last_name}</p>
                        <p className="text-sm text-text-muted truncate">{user?.user.email}</p>
                    </div>
                    <nav className="py-2">
                        {navItems.map(item => (
                            <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:bg-primary/20 hover:text-white transition-colors">
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t border-border pt-2 px-2">
                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded-md transition-colors">
                            <LogOut size={16} />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};