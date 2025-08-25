'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Tv, ShoppingCart, MessageSquare, UserPlus } from 'lucide-react';

const navItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, href: '/compte/dashboard' },
    { id: 'profil', label: 'Mon Profil', icon: User, href: '/compte/profil' },
    { id: 'abonnements', label: 'Abonnements', icon: Tv, href: '/compte/abonnements' },
    { id: 'commandes', label: 'Commandes', icon: ShoppingCart, href: '/compte/commandes' },
    { id: 'support', label: 'Support', icon: MessageSquare, href: '/compte/support' },
    { id: 'affilies', label: 'Affiliés', icon: UserPlus, href: '/compte/affilies' },
];

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-card border border-border rounded-lg p-4">
                    <nav className="flex flex-row md:flex-col gap-2">
                        {navItems.map(item => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                                    pathname === item.href
                                        ? 'bg-primary text-white'
                                        : 'text-text-muted hover:bg-primary/20 hover:text-white'
                                }`}
                            >
                                <item.icon size={16} />
                                <span className="hidden md:inline">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}