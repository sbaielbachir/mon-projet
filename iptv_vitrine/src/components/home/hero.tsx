"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slidesData = [
    {
        title: "L'Offre Standard : L'Essentiel, Sans Compromis",
        subtitle: "Accédez à des milliers de chaînes en Full HD et profitez d'un divertissement illimité.",
        price: "100",
        priceLabel: "POUR 1 AN",
        bgImage: "/placeholder-slider.png"
    },
    {
        title: "L'Expérience 4K Ultime",
        subtitle: "Plongez au cœur de l'action avec une qualité d'image 4K UHD à couper le souffle.",
        price: "150",
        priceLabel: "POUR 1 AN",
        bgImage: "/placeholder-slider.png"
    },
    {
        title: "Flexibilité Totale, Qualité Maximale",
        subtitle: "Choisissez nos forfaits de 3 ou 6 mois pour un divertissement sur mesure.",
        price: "80",
        priceLabel: "À PARTIR DE",
        bgImage: "/placeholder-slider.png"
    }
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % slidesData.length);
    };

    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + slidesData.length) % slidesData.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, []);

    const currentSlide = slidesData[currentIndex];

    return (
        <section className="relative min-h-screen flex items-center text-left overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div 
                    className="w-full h-full bg-cover bg-center transition-opacity duration-1000" 
                    style={{ backgroundImage: `url(${currentSlide.bgImage})` }}
                ></div>
                <div className="absolute inset-0 bg-background opacity-60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="max-w-2xl">
                        <div key={currentIndex} className="animate-fade-in">
                            <p className="text-lg font-semibold text-primary mb-2">// Le Meilleur du Divertissement</p>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                                {currentSlide.title}
                            </h1>
                            <p className="text-lg md:text-xl text-text-muted mb-10">
                                {currentSlide.subtitle}
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="/nos-plans" className="btn-primary">
                                    Découvrir
                                </Link>
                            </div>
                        </div>
                    </div>
                     {/* Price Bubble */}
                    {currentSlide.price && (
                        <div key={currentIndex + '-price'} className="hidden md:block animate-fade-in">
                            <div className="relative w-44 h-44">
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse"></div>
                                <div className="absolute inset-1 bg-background rounded-full flex flex-col items-center justify-center text-white text-center p-2">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-bold">{currentSlide.price}</span>
                                        <span className="text-2xl font-bold ml-1">C$</span>
                                    </div>
                                    <span className="text-base font-semibold tracking-wider">{currentSlide.priceLabel}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <button onClick={prevSlide} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><ChevronLeft/></button>
                {slidesData.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}></div>
                ))}
                <button onClick={nextSlide} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><ChevronRight/></button>
            </div>
        </section>
    );
};

export default HeroSlider;