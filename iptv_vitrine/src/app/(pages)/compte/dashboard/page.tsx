'use client';
import { useAuth } from '@/contexts/AuthContext';
import { Tv, MessageSquare, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
    <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">{title}</span>
            <Icon className="h-6 w-6 text-gray-500" />
        </div>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const dashboardData = (user as any).dashboard || { activeSubscriptions: 0, openTickets: 0, totalSpent: '0.00' };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Tableau de Bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Abonnements Actifs" value={dashboardData.activeSubscriptions} icon={Tv} />
                <StatCard title="Tickets Ouverts" value={dashboardData.openTickets} icon={MessageSquare} />
                <StatCard title="Total Dépensé" value={`${parseFloat(dashboardData.totalSpent).toFixed(2)} C$`} icon={DollarSign} />
            </div>
        </div>
    );
}