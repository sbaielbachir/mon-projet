import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { Bell as BellIcon, ShoppingCart as ShoppingCartIcon, Headset as HeadsetIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  type: 'new_order' | 'new_ticket' | 'ticket_reply';
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface NotificationsPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

export function NotificationsPopover({ anchorEl, onClose, open, notifications, setNotifications }: NotificationsPopoverProps): React.JSX.Element {

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_order': return <ShoppingCartIcon />;
      case 'new_ticket': return <HeadsetIcon />;
      case 'ticket_reply': return <HeadsetIcon />;
      default: return <BellIcon />;
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '380px' } } }}
    >
      <Box sx={{ p: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <Button size="small" onClick={handleMarkAllAsRead} disabled={!notifications.some(n => !n.read)}>
          Marquer comme lu
        </Button>
      </Box>
      <Divider />
      {notifications.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">Aucune notification</Typography>
      ) : (
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <ListItem key={notification.id} sx={{ bgcolor: !notification.read ? 'action.hover' : 'transparent' }}>
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={dayjs(notification.createdAt).fromNow()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Popover>
  );
}