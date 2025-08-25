"use client";
import { useState } from 'react';
import { ProcessedPlan } from '@/lib/types';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

interface PlansTabsProps {
    initialPlans: {
        standard: ProcessedPlan[];
        premium: ProcessedPlan[];
    };
}

// Map pour convertir les noms d'icônes en composants
const icons = LucideIcons as unknown as { [key: string]: LucideIcons.LucideIcon };

const PlanCard = ({ plan, type }: { plan: ProcessedPlan, type: 'standard' | 'premium' }) => {
    let highlightText = '';
    if (plan.isHighlighted) {
        highlightText = type === 'standard' ? 'Populaire' : 'Recommandé';
    }

    return (
        <div className={`p-8 rounded-2xl border-2 transition-all duration-300 ${plan.isHighlighted ? 'border-primary shadow-lg shadow-primary/20' : 'border-border bg-card'}`}>
            <h3 className="text-2xl font-bold">{plan.duration}</h3>
            <p className="text-primary font-semibold mb-6 h-6">{highlightText}</p>
            <div className="mb-6">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="text-xl font-semibold">{plan.currency}</span>
            </div>
            <Link href={`/commander/${plan.id}`} className={plan.isHighlighted ? 'btn-primary w-full block text-center' : 'btn-secondary w-full block text-center'}>
                Commander
            </Link>
            <ul className="mt-8 space-y-4 text-left">
                {plan.features.map((feature, index) => {
                    const IconComponent = icons[feature.iconName];
                    return (
                        <li key={index} className="flex items-center gap-3">
                            {IconComponent ? (
                                <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : (
                                <LucideIcons.CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                            <span className="text-text-muted">{feature.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const PlansTabs = ({ initialPlans }: PlansTabsProps) => {
    const [activeTab, setActiveTab] = useState<'standard' | 'premium'>('premium');

    return (
        <div>
            <div className="flex justify-center mb-8">
                <div className="bg-card p-1 rounded-full flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('standard')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'standard' ? 'bg-primary text-white' : 'text-text-muted'}`}
                    >
                        Standard
                    </button>
                    <button
                        onClick={() => setActiveTab('premium')}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'premium' ? 'bg-primary text-white' : 'text-text-muted'}`}
                    >
                        Premium
                    </button>
                </div>
            </div>

            <div>
                {activeTab === 'standard' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initialPlans.standard.map(plan => <PlanCard key={plan.id} plan={plan} type="standard" />)}
                    </div>
                )}
                {activeTab === 'premium' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initialPlans.premium.map(plan => <PlanCard key={plan.id} plan={plan} type="premium" />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlansTabs;