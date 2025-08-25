'use client';
import * as React from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography,
  Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText,
  CircularProgress, TextField, DialogActions
} from '@mui/material';
import dayjs from 'dayjs';
import { api } from '@/lib/api';

interface Request {
  id: number;
  client: { user: { username: string; }; };
  motivations: string;
  site_web: string;
  date_demande: string;
}

interface RequestsTableProps {
  items: Request[];
  onRequestProcessed: () => void;
}

export function RequestsTable({ items = [], onRequestProcessed }: RequestsTableProps): React.JSX.Element {
  const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [commission, setCommission] = React.useState('10');
  const [loadingAction, setLoadingAction] = React.useState(false);

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  const handleOpenApproveModal = (request: Request) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setLoadingAction(true);
    try {
      await api.post(`/affiliate-requests/${selectedRequest.id}/approve/`, {
        pourcentage_commission: commission
      });
      onRequestProcessed();
    } catch (error) {
      console.error("Erreur lors de l'approbation", error);
    } finally {
      setLoadingAction(false);
      setIsApproveModalOpen(false);
    }
  };

  const handleReject = async (requestId: number) => {
    setLoadingAction(true);
    try {
      await api.post(`/affiliate-requests/${requestId}/reject/`);
      onRequestProcessed();
    } catch (error) {
      console.error("Erreur lors du rejet", error);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <Dialog open={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)}>
        <DialogTitle>Détails de la demande</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="subtitle1" gutterBottom>Client : {selectedRequest?.client.user.username}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Motivations :</Typography>
            <Typography variant="body2">{selectedRequest?.motivations || 'Non fournies'}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Site web / Réseaux :</Typography>
            <Typography variant="body2">{selectedRequest?.site_web || 'Non fourni'}</Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
        <DialogTitle>Approuver la demande</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Veuillez définir le pourcentage de commission pour l'affilié {selectedRequest?.client.user.username}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Pourcentage de commission (%)"
            type="number"
            fullWidth
            variant="standard"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApproveModalOpen(false)}>Annuler</Button>
          <Button onClick={handleApprove} disabled={loadingAction}>
            {loadingAction ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Date de la demande</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">Aucune demande en attente.</TableCell>
                </TableRow>
              )}
              {items.map((request) => (
                <TableRow hover key={request.id}>
                  <TableCell>{request.client.user.username}</TableCell>
                  <TableCell>{dayjs(request.date_demande).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="outlined" onClick={() => handleViewDetails(request)}>
                        Détails
                      </Button>
                      <Button size="small" variant="contained" color="success" onClick={() => handleOpenApproveModal(request)} disabled={loadingAction}>
                        Approuver
                      </Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleReject(request.id)} disabled={loadingAction}>
                        Rejeter
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Card>
    </>
  );
}