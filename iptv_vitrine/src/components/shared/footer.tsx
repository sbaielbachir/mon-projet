"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20 text-text-muted">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Colonne 1: Logo et description */}
          <div className="space-y-4">
            <Link href="/" className="relative h-20 w-40 block">
                <Image 
                    src="/logo.png" 
                    alt="IPTV Fasty Logo"
                    fill
                    style={{objectFit: 'contain', objectPosition: 'left'}}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/160x80/010313/FFFFFF?text=Logo'; }}
                />
            </Link>
            <p className="text-sm">
              Votre source numéro un pour un divertissement IPTV de haute qualité. Accédez à des milliers de chaînes, films et séries sans interruption.
            </p>
            <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Linkedin" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Colonne 2: Liens Rapides */}
          <div className="md:justify-self-center">
            <h3 className="font-bold text-lg text-white mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/nos-plans" className="hover:text-primary transition-colors">Nos Plans</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Colonne 3: Support */}
          <div className="md:justify-self-center">
            <h3 className="font-bold text-lg text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/installation" className="hover:text-primary transition-colors">Guides d'installation</Link></li>
              <li><Link href="/politique-de-confidentialite" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/termes-et-conditions" className="hover:text-primary transition-colors">Termes et Conditions</Link></li>
              <li><Link href="/politique-de-remboursement" className="hover:text-primary transition-colors">Politique de Remboursement</Link></li>
              <li><Link href="/avis-de-non-responsabilite" className="hover:text-primary transition-colors">Avis de non-responsabilité</Link></li>
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Contactez-nous</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-primary"/>
                <span>Laval, Québec, Canada</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 flex-shrink-0 text-primary"/>
                <a href="tel:514-473-4752" className="hover:text-primary transition-colors">514-473-4752</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 flex-shrink-0 text-primary"/>
                <a href="mailto:contact@iptvfasty.com" className="hover:text-primary transition-colors">contact@iptvfasty.com</a>
              </li>
            </ul>
          </div>

        </div>
        <div className="border-t border-border pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} IPTV Fasty. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;