// iptv_crm/src/app/dashboard/layout.tsx (Mis à jour avec le nouveau style de notification)

'use client';

import * as React from 'react';
import { useMemo, useCallback } from 'react';
import { Snackbar, Alert, AlertTitle, Typography } from '@mui/material'; // Typography ajouté
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useUser } from '@/hooks/use-user';
import { useWebSocket } from '@/hooks/use-websocket';
import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

// NOUVELLE INTERFACE pour l'état de la notification
interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
}

interface WsMessageData {
  type: 'new_order' | 'new_ticket' | 'ticket_reply';
  data: any;
}

export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [notification, setNotification] = React.useState<NotificationState | null>(null);
  const { user } = useUser();

  const webSocketPath = useMemo(() => {
    if (user?.is_staff) {
      return '/ws/admin/notifications/';
    }
    return null;
  }, [user]);

  // NOUVELLE GESTION DES MESSAGES pour correspondre au style désiré
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const eventData = JSON.parse(event.data);
      
      if (eventData?.type === 'notification' && eventData.message) {
        const message: WsMessageData = eventData.message;
        let msg = '';
        
        switch (message.type) {
          case 'new_order':
            msg = `Nouvelle commande reçue: #${message.data.id}`;
            break;
          case 'new_ticket':
            msg = `Nouveau ticket de support: "${message.data.sujet}"`;
            break;
          case 'ticket_reply':
            msg = `${message.data.auteur} a répondu au ticket #${message.data.ticket_id}.`;
            break;
        }

        if (msg) {
          setNotification({ 
            open: true, 
            message: msg, 
            severity: 'success', // Pour la couleur verte
            timestamp: new Date().toUTCString() // Format GMT comme sur la capture
          });
        }
      }
    } catch (e) {
      console.error('WebSocket: Erreur lors du parsing du message.', e);
    }
  }, []);

  useWebSocket(webSocketPath, { onMessage: handleWebSocketMessage });

  const handleCloseNotification = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(null);
  };

  return (
    <AuthGuard>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
          '--SideNav-width': '280px',
          '--SideNav-zIndex': 1000,
          '--MobileNav-width': '320px',
          '--MobileNav-zIndex': 1100,
        }}
      >
        <SideNav />
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
          }}
        >
          <MainNav />
          <main>
            <Container maxWidth="xl" sx={{ py: '64px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
      
      {/* --- SECTION DE NOTIFICATION MODIFIÉE --- */}
      <Snackbar
        open={!!notification?.open}
        autoHideDuration={10000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: '72px', mr: '8px' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification?.severity || 'info'}
          icon={false} // On cache l'icône par défaut
          sx={{
            width: '100%',
            minWidth: '340px',
            backgroundColor: 'rgb(46, 125, 50)', // Vert foncé, similaire à la capture
            color: 'white',
            borderRadius: '8px',
            boxShadow: 3,
            '& .MuiAlert-action': {
              padding: '4px 8px 0 16px',
              alignItems: 'flex-start',
            },
            '& .MuiAlert-action .MuiIconButton-root': {
              color: 'white',
            },
            '& .MuiAlert-message': {
              padding: '4px 0',
            }
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>{notification?.message}</Typography>
          {notification?.timestamp && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
              {notification.timestamp}
            </Typography>
          )}
        </Alert>
      </Snackbar>
      {/* --- FIN DE LA SECTION MODIFIÉE --- */}
    </AuthGuard>
  );
}