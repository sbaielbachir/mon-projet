"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slidesData = [
    {
        tagline: "L'essentiel, sans compromis",
        title: "L'Offre Standard Idéale",
        subtitle: "Accédez à des milliers de chaînes en Full HD, VOD et profitez d'un divertissement illimité pour toute la famille.",
        price: "100",
        priceLabel: "POUR 1 AN",
        bgImage: "/placeholder-slider-1.png", // Image dans public/
        planLink: "/nos-plans"
    },
    {
        tagline: "Qualité d'image inégalée",
        title: "L'Expérience 4K Ultime",
        subtitle: "Plongez au cœur de l'action avec une qualité d'image 4K UHD à couper le souffle et un accès premium.",
        price: "150",
        priceLabel: "POUR 1 AN",
        bgImage: "/placeholder-slider-2.png", // Image dans public/
        planLink: "/nos-plans"
    },
    {
        tagline: "Flexibilité totale",
        title: "Un Plan Pour Chaque Besoin",
        subtitle: "Choisissez nos forfaits de 3 ou 6 mois pour un divertissement sur mesure, sans engagement à long terme.",
        price: "80",
        priceLabel: "À PARTIR DE",
        bgImage: "/placeholder-slider-3.png", // Image dans public/
        planLink: "/nos-plans"
    }
];

const HeroSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleSlideChange = (newIndex: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(newIndex);
        setTimeout(() => setIsAnimating(false), 1000);
    };

    const nextSlide = () => {
        handleSlideChange((currentIndex + 1) % slidesData.length);
    };

    const prevSlide = () => {
        handleSlideChange((currentIndex - 1 + slidesData.length) % slidesData.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const currentSlide = slidesData[currentIndex];

    return (
        <section className="relative min-h-screen flex items-center text-left overflow-hidden">
            <div className="absolute inset-0 z-0">
                {slidesData.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={slide.bgImage}
                            alt={`Arrière-plan pour ${slide.title}`}
                            fill
                            priority={index === 0}
                            style={{ objectFit: 'cover' }}
                            sizes="100vw"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/1920x1080/010313/FFFFFF?text=Image+Indisponible'; }}
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-background opacity-60"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="relative max-w-3xl">
                    <div key={currentIndex} className="relative">
                        {currentSlide.price && (
                            <div className="absolute -top-12 right-0 md:-right-24 animate-bubble-pop-in [animation-delay:0.6s]">
                                <div className="relative w-36 h-36">
                                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-full animate-pulse"></div>
                                    <div className="absolute inset-1 bg-background rounded-full flex flex-col items-center justify-center text-white text-center p-2">
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold">{currentSlide.price}</span>
                                            <span className="text-xl font-bold ml-1">C$</span>
                                        </div>
                                        <span className="text-sm font-semibold tracking-wider">{currentSlide.priceLabel}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-lg font-semibold text-primary mb-2 animate-hero-fade-in-up [animation-delay:0.2s]">
                            // {currentSlide.tagline}
                        </p>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-hero-fade-in-up [animation-delay:0.4s]">
                            {currentSlide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-text-muted mb-10 animate-hero-fade-in-up [animation-delay:0.6s]">
                            {currentSlide.subtitle}
                        </p>
                        <div className="flex items-center gap-4 animate-hero-fade-in-up [animation-delay:0.8s]">
                            <Link href={currentSlide.planLink} className="btn-primary">
                                Voir les abonnements
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                <button onClick={prevSlide} aria-label="Slide précédent" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><ChevronLeft/></button>
                {slidesData.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleSlideChange(index)}
                        aria-label={`Aller au slide ${index + 1}`}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                    ></button>
                ))}
                <button onClick={nextSlide} aria-label="Slide suivant" className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"><ChevronRight/></button>
            </div>
        </section>
    );
};

export default HeroSlider;