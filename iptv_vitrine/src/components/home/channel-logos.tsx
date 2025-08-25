"use client";
import Image from 'next/image';

const logos = [
    { name: 'Bein Sports', src: '/logos/bein-sports.svg' },
    { name: 'Canal+', src: '/logos/Canal+.svg' },
    { name: 'Canal+ Sport', src: '/logos/Canal+Sport.svg' },
    { name: 'Dazn Sport', src: '/logos/DAZN.svg' },
    { name: 'ESPN', src: '/logos/espn.svg' },
    { name: 'ESPN Premium', src: '/logos/espn-premium.png' },
    { name: 'Eurosport', src: '/logos/Eurosport.svg' },
    { name: 'Fox Sports', src: '/logos/fox-Sports.svg' },
    { name: 'NBC Sports', src: '/logos/nbc-sports.svg' },
    { name: 'One Sports', src: '/logos/one-sports.svg' },
    { name: 'Prodigy Sports', src: '/logos/prodigy-sports.png' },
    { name: 'RMC Sport', src: '/logos/rmc-sport.png' },
    { name: 'Sky Sports', src: '/logos/sky-sports.svg' },
    { name: 'Sport TV1', src: '/logos/Sport-TV1.svg' },
];

const extendedLogos = [...logos, ...logos];

const ChannelLogos = () => {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-2">Les Meilleurs Bouquets Mondiaux</h2>
                <p className="text-text-muted mb-12">Accédez à une sélection inégalée de chaînes du monde entier.</p>
                <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div className="flex min-w-full shrink-0 gap-8 w-max flex-nowrap animate-scroll-left">
                        {extendedLogos.map((logo, idx) => (
                            <div key={idx} className="flex-shrink-0 w-40 h-24 flex items-center justify-center p-4 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={logo.src}
                                        alt={logo.name}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="160px"
                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/150x80/FFFFFF/000000?text=Logo`; }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChannelLogos;