"use client";
import { useState } from 'react';
import { FaqItem } from '@/lib/types';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
    items: FaqItem[];
}

const FaqAccordion = ({ items }: FaqAccordionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full flex justify-between items-center text-left p-6 font-semibold"
                        >
                            <span>{item.question}</span>
                            <ChevronDown className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                            className={`grid transition-all duration-500 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                            <div className="overflow-hidden">
                                <p className="text-text-muted p-6 pt-0">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FaqAccordion;