"use client";

import Link from 'next/link';
import Image from 'next/image';
// CORRECTION : Ajout des icônes manquantes (Facebook, Twitter, etc.)
import { Clock, Mail, Phone, Menu, X, User, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPopover } from './LoginPopover';
import { UserMenu } from './UserMenu';

const Header = () => {
  const [isSticky, setSticky] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();
  
  const [loginPopoverOpen, setLoginPopoverOpen] = useState(false);
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className={`w-full z-50 transition-all duration-300 ${isSticky ? 'fixed top-0 bg-background/80 backdrop-blur-lg shadow-lg' : 'absolute bg-transparent'}`}>
        <div className="hidden md:block bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 text-sm">
            <div className="container mx-auto px-4 flex justify-between items-center h-10 text-white">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2"><Clock size={16} /><span>Lun - Sam: 8h00 - 18h00</span></div>
                    <div className="flex items-center gap-2"><Mail size={16} /><a href="mailto:contact@iptvfasty.com" className="hover:text-primary">contact@iptvfasty.com</a></div>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" aria-label="Facebook" className="hover:text-primary"><Facebook size={16} /></a>
                    <a href="#" aria-label="Twitter" className="hover:text-primary"><Twitter size={16} /></a>
                    <a href="#" aria-label="Instagram" className="hover:text-primary"><Instagram size={16} /></a>
                    <a href="#" aria-label="Linkedin" className="hover:text-primary"><Linkedin size={16} /></a>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white">
          <nav className="container mx-auto px-4 h-24 flex items-center justify-between gap-4">
              <Link href="/" className="relative h-20 w-40 flex-shrink-0">
                  <Image src="/logo.png" alt="IPTV Fasty Logo" fill style={{objectFit: 'contain'}} sizes="160px" priority />
              </Link>

              <div className="hidden lg:flex items-center gap-6 font-semibold">
                <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
                <Link href="/nos-plans" className="hover:text-black transition-colors">Nos Plans</Link>
                <Link href="/installation" className="hover:text-black transition-colors">Installation</Link>
                <Link href="/faq" className="hover:text-black transition-colors">FAQ</Link>
                <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
              </div>
              
              <div className="flex items-center gap-4 flex-shrink-0">
                  {!isLoading && (
                    user ? (
                      <UserMenu />
                    ) : (
                      <button ref={loginButtonRef} onClick={() => setLoginPopoverOpen(true)} className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-colors">
                          <User size={16} />
                          <span>Mon Compte</span>
                      </button>
                    )
                  )}

                  <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/20">
                      <div className="bg-white/10 p-3 rounded-full"><Phone size={24} className="text-white"/></div>
                      <div>
                          <p className="text-xs text-white/70">Besoin d'aide ?</p>
                          <p className="font-bold text-lg whitespace-nowrap">514-473-4752</p>
                      </div>
                  </div>
                  <div className="lg:hidden">
                      <button onClick={() => setMenuOpen(!isMenuOpen)} aria-label="Ouvrir le menu"><Menu size={28} /></button>
                  </div>
              </div>
          </nav>
        </div>
      </header>
      <LoginPopover anchorEl={loginButtonRef.current} open={loginPopoverOpen} onClose={() => setLoginPopoverOpen(false)} />
    </>
  );
};

export default Header;
