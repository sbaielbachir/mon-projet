import { useState, useEffect, useRef, useCallback } from 'react';

// Type pour le callback qui gère les messages
type MessageHandler = (event: MessageEvent) => void;

// Options pour le hook
interface UseWebSocketOptions {
  onMessage: MessageHandler;
  reconnectLimit?: number;      // Nombre maximum de tentatives de reconnexion
  reconnectInterval?: number;   // Intervalle initial en millisecondes
}

// Type de retour du hook
interface WebSocketState {
  isReady: boolean;
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
}

// Fonction pour récupérer le token d'accès de manière sécurisée
function getAccessTokenFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('access_token');
}

/**
 * Un hook React personnalisé pour gérer une connexion WebSocket avec 
 * une logique de reconnexion automatique.
 * @param path Le chemin de l'endpoint WebSocket (ex: '/ws/user/notifications/'). Mettre à null pour ne pas connecter.
 * @param options Les options, incluant le callback onMessage.
 */
export const useWebSocket = (
  path: string | null,
  { onMessage, reconnectLimit = 5, reconnectInterval = 1000 }: UseWebSocketOptions
): WebSocketState => {
  const [isReady, setIsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Fonction pour envoyer des messages, memoizée pour la stabilité
  const sendMessage = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    } else {
      console.warn('WebSocket n\'est pas ouvert. Message non envoyé:', data);
    }
  }, []);

  useEffect(() => {
    // Ne rien faire si on est côté serveur ou si le chemin n'est pas fourni
    if (!path || typeof window === 'undefined') {
      return;
    }

    const connect = () => {
      const token = getAccessTokenFromStorage();
      if (!token) {
        console.log('WebSocket: Aucun token d\'accès trouvé, connexion annulée.');
        return;
      }

      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiUrl) {
        console.error("L'URL de l'API n'est pas configurée pour le WebSocket.");
        return;
      }
      
      const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');
      const url = `${wsProtocol}://${host}${path}?token=${token}`;

      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log(`WebSocket connecté à ${path}`);
        setIsReady(true);
        reconnectAttemptsRef.current = 0; // Réinitialiser les tentatives après une connexion réussie
      };

      socket.onmessage = onMessage;

      socket.onerror = (event) => {
        console.error('WebSocket erreur:', event);
      };

      socket.onclose = () => {
        console.log(`WebSocket déconnecté de ${path}`);
        setIsReady(false);

        // Logique de reconnexion avec backoff exponentiel
        if (reconnectAttemptsRef.current < reconnectLimit) {
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * reconnectInterval;
          console.log(`Tentative de reconnexion dans ${timeout / 1000} secondes...`);
          setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, timeout);
        } else {
          console.error('WebSocket: Limite de reconnexion atteinte.');
        }
      };
    };

    connect();

    // Fonction de nettoyage pour fermer la connexion
    return () => {
      if (wsRef.current) {
        // Empêche les tentatives de reconnexion lors du démontage du composant
        reconnectAttemptsRef.current = reconnectLimit; 
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  // Les dépendances incluent `path` pour que le hook se reconnecte si l'URL change
  }, [path, onMessage, reconnectLimit, reconnectInterval]);

  return { isReady, sendMessage };
};