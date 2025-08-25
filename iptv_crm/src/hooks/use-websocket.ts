// src/hooks/use-websocket.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api'; // Import de l'instance axios pour déclencher le rafraîchissement du token

type MessageHandler = (event: MessageEvent) => void;

interface UseWebSocketOptions {
  onMessage: MessageHandler;
  reconnectLimit?: number;
  reconnectInterval?: number;
}

interface WebSocketState {
  isReady: boolean;
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
}

function getAccessTokenFromStorage(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('access_token');
}

export const useWebSocket = (
  path: string | null,
  { onMessage, reconnectLimit = 5, reconnectInterval = 1000 }: UseWebSocketOptions
): WebSocketState => {
  const [isReady, setIsReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    } else {
      console.warn("WebSocket n'est pas ouvert. Message non envoyé:", data);
    }
  }, []);

  useEffect(() => {
    if (!path || typeof window === 'undefined') {
      return;
    }

    const connect = () => {
      const token = getAccessTokenFromStorage();
      if (!token) {
        console.warn("WebSocket: Aucun token d'accès trouvé, connexion annulée.");
        return;
      }

      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiUrl) {
        console.error("L'URL de l'API (NEXT_PUBLIC_API_BASE_URL) n'est pas configurée pour le WebSocket.");
        return;
      }
      
      const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');
      const url = `${wsProtocol}://${host}${path}?token=${token}`;
      
      console.log(`[WebSocket] Tentative de connexion à : ${url}`);

      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log(`[WebSocket] Connecté avec succès à ${path}`);
        setIsReady(true);
        reconnectAttemptsRef.current = 0;
        if(reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      };

      socket.onmessage = onMessage;

      socket.onerror = (event) => {
        console.error(`[WebSocket] Erreur de connexion sur ${path}. L'objet Event est :`, event);
      };

      socket.onclose = (event) => {
        console.log(`[WebSocket] Déconnecté de ${path}. Code: ${event.code}, Raison: ${event.reason}`);
        setIsReady(false);

        if (reconnectAttemptsRef.current < reconnectLimit) {
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * reconnectInterval;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`[WebSocket] Tentative de reconnexion (essai ${reconnectAttemptsRef.current + 1})...`);
            
            api.get('/client/me/').then(() => {
                console.log('[WebSocket] Vérification du token réussie avant reconnexion.');
                reconnectAttemptsRef.current++;
                connect();
            }).catch(error => {
                console.warn('[WebSocket] Impossible de rafraîchir le token, arrêt des tentatives de reconnexion.', error);
                reconnectAttemptsRef.current = reconnectLimit;
            });
          }, timeout);
        } else {
          console.warn('[WebSocket] Limite de reconnexion atteinte.');
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        reconnectAttemptsRef.current = reconnectLimit; 
        wsRef.current.close();
        wsRef.current = null;
        console.log('[WebSocket] Connexion nettoyée.');
      }
    };
  }, [path, onMessage, reconnectLimit, reconnectInterval]);

  return { isReady, sendMessage };
};