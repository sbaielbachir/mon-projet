"use client";

import { useState } from 'react';
import Image from 'next/image';
import * as LucideIcons from 'lucide-react';

const tutorials = [
    {
        device: 'Smart TV (Samsung/LG)',
        icon: 'Tv',
        steps: [
            "Allumez votre Smart TV et ouvrez le magasin d'applications (App Store).",
            "Recherchez et installez l'application 'IPTV Smarters Pro' ou une application similaire.",
            "Ouvrez l'application et choisissez 'Se connecter avec l'API Xtream Codes'.",
            "Entrez les identifiants (nom d'utilisateur, mot de passe, URL du serveur) que nous vous avons envoyés par e-mail.",
            "Cliquez sur 'Ajouter un utilisateur' et commencez à regarder !"
        ]
    },
    {
        device: 'Boîtier Android / Firestick',
        icon: 'Box',
        steps: [
            "Sur votre appareil, allez dans les paramètres et autorisez l'installation d'applications de sources inconnues.",
            "Ouvrez le navigateur et installez l'application 'Downloader'.",
            "Dans Downloader, entrez l'URL de l'APK de notre application (fournie par e-mail) et téléchargez-la.",
            "Installez l'application, ouvrez-la et entrez vos identifiants de connexion.",
            "Profitez de milliers de chaînes et de films."
        ]
    },
    {
        device: 'Apple TV / iPhone / iPad',
        icon: 'Apple',
        steps: [
            "Ouvrez l'App Store sur votre appareil Apple.",
            "Recherchez et téléchargez une application compatible comme 'GSE Smart IPTV' ou 'iPlayTV'.",
            "Ouvrez l'application et ajoutez une nouvelle playlist en utilisant l'URL M3U que nous vous avons fournie.",
            "Donnez un nom à votre playlist (ex: Fasty IPTV).",
            "Votre liste de chaînes va se charger. Bon visionnage !"
        ]
    },
    {
        device: 'Ordinateur (Windows/Mac)',
        icon: 'Laptop',
        steps: [
            "Téléchargez et installez le lecteur multimédia VLC (disponible sur videolan.org).",
            "Ouvrez VLC. Si vous êtes sur Mac, allez dans 'Fichier' > 'Ouvrir un flux réseau'. Sur Windows, 'Média' > 'Ouvrir un flux réseau'.",
            "Dans l'onglet 'Réseau', collez l'URL de la playlist M3U que nous vous avons envoyée.",
            "Cliquez sur 'Ouvrir' ou 'Lire'.",
            "Pour voir la liste des chaînes, activez la vue 'Playlist' dans VLC (Vue > Playlist)."
        ]
    }
];

const InstallationGuide = () => {
    const [selectedDevice, setSelectedDevice] = useState(tutorials[0]);
    const icons = LucideIcons as unknown as { [key: string]: LucideIcons.LucideIcon };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-card p-4 rounded-2xl border border-border space-y-2">
                    {tutorials.map(tutorial => {
                        const IconComponent = icons[tutorial.icon];
                        return (
                            <button
                                key={tutorial.device}
                                onClick={() => setSelectedDevice(tutorial)}
                                className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-colors ${selectedDevice.device === tutorial.device ? 'bg-primary/20 text-white' : 'hover:bg-primary/10'}`}
                            >
                                {IconComponent && <IconComponent className="h-6 w-6 text-primary flex-shrink-0" />}
                                <span className="font-semibold">{tutorial.device}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-card p-8 rounded-2xl border border-border">
                    <h3 className="text-2xl font-bold mb-6 text-white">Guide pour {selectedDevice.device}</h3>
                    <ol className="space-y-4">
                        {selectedDevice.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center">
                                    {index + 1}
                                </div>
                                <p className="text-text-muted pt-1">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default InstallationGuide;