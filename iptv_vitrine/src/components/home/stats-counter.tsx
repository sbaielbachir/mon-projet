"use client";

import { useEffect, useState, useRef } from 'react';

const StatItem = ({ endValue, label }: { endValue: number, label: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const duration = 2000; // 2 secondes

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const end = endValue;
                    if (start === end) return;

                    const incrementTime = (duration / end);
                    const timer = setInterval(() => {
                        start += 1;
                        setCount(start);
                        if (start === end) clearInterval(timer);
                    }, incrementTime);

                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [endValue]);

    return (
        <div ref={ref} className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-white">
                {count}+
            </p>
            <p className="text-sm uppercase tracking-widest text-text-muted">{label}</p>
        </div>
    );
};

const StatsCounter = () => {
    return (
        <div className="bg-gradient-to-r from-primary/80 to-secondary/80 py-8">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatItem endValue={645} label="Clients Satisfaits" />
                <StatItem endValue={753} label="Lignes Actives" />
                <StatItem endValue={75} label="Clients par Pays" />
                <StatItem endValue={8} label="Années d'Expérience" />
            </div>
        </div>
    );
};

export default StatsCounter;