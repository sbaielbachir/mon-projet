'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon, List as ListIcon, Users as UsersIcon } from '@phosphor-icons/react';

import { usePopover } from '@/hooks/use-popover';
import { useUser } from '@/hooks/use-user';
import { useWebSocket } from '@/hooks/use-websocket';
import { api } from '@/lib/api'; // Import de l'API

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { NotificationsPopover } from './notifications-popover';
import { ContactsPopover } from './contacts-popover'; // Import du nouveau composant

interface Notification {
  id: string;
  type: 'new_order' | 'new_ticket' | 'ticket_reply';
  message: string;
  createdAt: Date;
  read: boolean;
}

// Interface pour un contact
interface Contact {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  avatar: string | null;
}

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const userPopover = usePopover<HTMLDivElement>();
  const notificationsPopover = usePopover<HTMLButtonElement>();
  const contactsPopover = usePopover<HTMLButtonElement>(); // Popover pour les contacts
  const { user } = useUser();

  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [contacts, setContacts] = React.useState<Contact[]>([]); // État pour les contacts

  // --- Logique WebSocket (inchangée) ---
  const handleWebSocketMessage = React.useCallback((event: MessageEvent) => {
    try {
      const eventData = JSON.parse(event.data);
      if (eventData?.type === 'notification' && eventData.message) {
        const message = eventData.message;
        let notificationMessage = '';

        switch (message.type) {
          case 'new_order':
            notificationMessage = `Nouvelle commande #${message.data.id} par ${message.data.client?.user?.username || 'un client'}.`;
            break;
          case 'new_ticket':
            notificationMessage = `Nouveau ticket de ${message.data.client?.user?.username || 'un client'}.`;
            break;
          case 'ticket_reply':
             notificationMessage = `${message.data.auteur} a répondu au ticket #${message.data.ticket_id}.`;
            break;
        }

        if (notificationMessage) {
          const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            type: message.type,
            message: notificationMessage,
            createdAt: new Date(),
            read: false,
          };
          setNotifications((prev) => [newNotification, ...prev]);
        }
      }
    } catch (e) {
      console.error('WebSocket: Erreur lors du parsing du message.', e);
    }
  }, []);

  useWebSocket(user?.is_staff ? '/ws/admin/notifications/' : null, { onMessage: handleWebSocketMessage });

  // --- NOUVEAU : Récupération des contacts ---
  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await api.get('/clients/');
        // On prend les 5 clients les plus récents (la liste est déjà triée par le backend)
        setContacts(response.data.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
      }
    };

    if (user?.is_staff) {
      fetchContacts();
    }
  }, [user]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton onClick={(): void => { setOpenNav(true); }} sx={{ display: { lg: 'none' } }} >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* --- BOUTON CONTACTS MODIFIÉ --- */}
            <Tooltip title="Contacts">
              <IconButton onClick={contactsPopover.handleOpen} ref={contactsPopover.anchorRef}>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={unreadCount} color="success" variant="dot">
                <IconButton onClick={notificationsPopover.handleOpen} ref={notificationsPopover.anchorRef}>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={user?.avatar || '/assets/avatar.png'}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <NotificationsPopover 
        anchorEl={notificationsPopover.anchorRef.current} 
        onClose={notificationsPopover.handleClose} 
        open={notificationsPopover.open}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      {/* --- NOUVEAU POPOVER AJOUTÉ --- */}
      <ContactsPopover
        anchorEl={contactsPopover.anchorRef.current}
        onClose={contactsPopover.handleClose}
        open={contactsPopover.open}
        contacts={contacts}
      />
      <MobileNav onClose={() => { setOpenNav(false); }} open={openNav} />
    </React.Fragment>
  );
}