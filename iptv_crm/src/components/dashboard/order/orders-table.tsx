'use client';
import * as React from 'react';
import {
  Box,
  Card,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, // Importation corrigée
  Button,
} from '@mui/material';
import { Eye as ViewIcon, Trash as DeleteIcon } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/app/dashboard/orders/page';
import { api } from '@/lib/api';

interface OrdersTableProps {
  items: Order[];
  onRefresh: () => void;
}

export function OrdersTable({ items = [], onRefresh }: OrdersTableProps): React.JSX.Element {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<number | null>(null);

  const statusMap = {
    en_attente: { label: 'En attente', color: 'warning' },
    paye: { label: 'Payé', color: 'success' },
    annule: { label: 'Annulé', color: 'error' },
  } as const;

  const handleOpenDeleteDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSelectedOrderId(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    try {
      await api.delete(`/commandes/${selectedOrderId}/`);
      onRefresh();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Une erreur est survenue.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  return (
    <>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '900px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Commande #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Email Client</TableCell>
                <TableCell>Produit</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((order) => {
                const status = statusMap[order.statut_paiement] ?? { label: 'Inconnu', color: 'default' };
                const clientName = order.client?.user ? `${order.client.user.first_name} ${order.client.user.last_name}`.trim() : 'Client non trouvé';
                const clientEmail = order.client?.user ? order.client.user.email : 'N/A';

                return (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{clientName}</TableCell>
                    <TableCell>{clientEmail}</TableCell>
                    <TableCell>{order.produit ? order.produit.nom : 'Produit supprimé'}</TableCell>
                    <TableCell>{order.montant} $</TableCell>
                    <TableCell>{new Date(order.date_commande).toLocaleDateString('fr-CA')}</TableCell>
                    <TableCell><Chip label={status.label} color={status.color as any} size="small" /></TableCell>
                    <TableCell>
                      <Tooltip title="Voir les détails">
                        <IconButton onClick={() => router.push(`/dashboard/orders/${order.id}`)}><ViewIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(order.id)}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Card>
      
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer définitivement la commande #{selectedOrderId} ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDelete} color="error" autoFocus>Supprimer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
