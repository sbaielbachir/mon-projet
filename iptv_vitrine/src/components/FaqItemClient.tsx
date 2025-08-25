// Fichier : iptv_vitrine/src/components/FaqItemClient.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
}

export const FaqItemClient = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Conteneur principal de chaque item FAQ
    <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg overflow-hidden">
      {/* Bouton cliquable pour la question */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left text-lg font-medium text-white focus:outline-none"
      >
        <span>{question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 text-gray-400 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Section de la réponse, qui s'affiche ou se cache */}
      {isOpen && (
        <div className="px-5 pb-5 text-gray-300">
          {/* Ligne de séparation */}
          <hr className="border-t border-gray-700 mb-4" />
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};
