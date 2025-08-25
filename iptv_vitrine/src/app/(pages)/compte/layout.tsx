'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Loader2 } from 'lucide-react';
import ClientPortalLayout from '@/components/account/ClientPortalLayout';
import { Toaster } from 'react-hot-toast';
import NotificationListener from '@/components/NotificationListener';


export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Le Toaster est ajouté ici pour gérer les notifications sur toutes les pages du compte */}

            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: '!bg-card !text-white !border !border-border',
                }}
            />
            <NotificationListener />
            <Header />
            <main className="pt-40 pb-20 flex-grow">
                <div className="container mx-auto px-4">
                    <ClientPortalLayout>
                        {children}
                    </ClientPortalLayout>
                </div>
            </main>
            <Footer />
        </>
    );

}