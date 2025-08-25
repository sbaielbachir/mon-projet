import * as React from 'react';
import RouterLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Typography,
  Divider,
  ListItemButton, // CORRECTION : Importer ListItemButton
} from '@mui/material';

import { paths } from '@/paths';

// Définition du type pour un contact, pour plus de clarté
interface Contact {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  avatar: string | null; // L'avatar peut être null
}

export interface ContactsPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  contacts: Contact[];
}

export function ContactsPopover({ anchorEl, onClose, open, contacts = [] }: ContactsPopoverProps): React.JSX.Element {
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '380px' } } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Contacts Récents</Typography>
      </Box>
      <Divider />
      {contacts.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
          Aucun contact à afficher
        </Typography>
      ) : (
        <List sx={{ p: 1, maxHeight: 400, overflow: 'auto' }}>
          {contacts.map((contact) => (
            // CORRECTION : Remplacer ListItem avec la prop `button` par un ListItemButton imbriqué
            // pour une meilleure sémantique et pour éviter l'erreur de prop non-booléenne.
            <ListItem
              key={contact.id}
              disablePadding // Recommandé lors de l'utilisation de ListItemButton
            >
              <ListItemButton
                component={RouterLink}
                href={paths.dashboard.customers} // Redirige vers la page des clients
                onClick={onClose}
              >
                <ListItemAvatar>
                  <Avatar src={contact.avatar || '/assets/avatar.png'} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${contact.user.first_name} ${contact.user.last_name}`}
                  secondary={contact.user.email}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Divider />
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Button component={RouterLink} href={paths.dashboard.customers} onClick={onClose} size="small">
          Voir tous les clients
        </Button>
      </Box>
    </Popover>
  );
}