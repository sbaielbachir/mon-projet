"use client";
import Image from 'next/image';

const devices = [
    { name: 'Smart TV', logo: '/devices/smart-tv.svg' },
    { name: 'Android', logo: '/devices/android.svg' },
    { name: 'Web OS', logo: '/devices/WebOS.svg' },
    { name: 'Apple TV', logo: '/devices/apple-tv.svg' },
    { name: 'chrome', logo: '/devices/chrome.svg' },
    { name: 'Firestick', logo: '/devices/firestick.png' },
    { name: 'iOS', logo: '/devices/ios.png' },
    { name: 'Egde', logo: '/devices/edge.svg' },
    { name: 'Windows', logo: '/devices/windows.svg' },
    { name: 'MAG Box', logo: '/devices/mag-box.png' },
    { name: 'Navigateur', logo: '/devices/globe.svg' },
];

const extendedDevices = [...devices, ...devices];

const Compatibility = () => {
    return (
        <section id="compatibilite" className="py-20 bg-card border-y border-border">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Compatible Avec Tous Vos Appareils</h2>
                    <p className="text-text-muted mt-4 max-w-2xl mx-auto">Regardez votre contenu préféré où que vous soyez, sur l'appareil de votre choix.</p>
                </div>
                <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div className="flex min-w-full shrink-0 gap-8 w-max flex-nowrap animate-scroll-left [animation-duration:90s]">
                        {extendedDevices.map((device, idx) => (
                            <div key={idx} className="flex-shrink-0 w-40 h-32 flex flex-col items-center justify-center p-4 bg-background border border-border rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={device.logo}
                                        alt={device.name}
                                        fill
                                        style={{ objectFit: 'contain', filter: 'brightness(0.9)' }}
                                        sizes="64px"
                                        onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/64x64/010313/a1a1b4?text=Icon`; }}
                                    />
                                </div>
                                <p className="mt-4 font-semibold text-text-muted">{device.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Compatibility;