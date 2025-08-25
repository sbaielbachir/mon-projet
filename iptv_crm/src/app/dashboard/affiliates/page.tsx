'use client';
import * as React from 'react';
import { Box, Typography, Stack, Button, SvgIcon, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { AffiliatesTable } from '@/components/dashboard/affiliate/affiliates-table';
import { CreateAffiliateModal } from '@/components/dashboard/affiliate/create-affiliate-modal';
import { EditAffiliateModal } from '@/components/dashboard/affiliate/edit-affiliate-modal'; // Nouveau composant
import { api } from '@/lib/api';

interface Affiliate {
  id: number;
  nom: string;
  type_affilie: 'CLIENT' | 'EVENEMENT';
  client: { user: { username: string; }; } | null;
  code_affiliation: string;
  pourcentage_commission: string;
  solde_commission: string;
  date_creation: string;
}

export default function AffiliatesPage(): React.JSX.Element {
  const [affiliates, setAffiliates] = React.useState<Affiliate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // State pour les modales
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = React.useState<Affiliate | null>(null);

  const fetchAffiliates = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/affilies/');
      setAffiliates(response.data);
    } catch (err) {
      console.error("Erreur de récupération des affiliés:", err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des affiliés');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  // --- Gestionnaires d'événements pour les actions ---
  const handleEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAffiliate) return;
    try {
      await api.delete(`/affilies/${selectedAffiliate.id}/`);
      fetchAffiliates(); // Rafraîchir la liste
    } catch (err) {
      setError("La suppression a échoué.");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAffiliate(null);
    }
  };

  return (
    <>
      <CreateAffiliateModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onAffiliateCreated={fetchAffiliates} 
      />
      <EditAffiliateModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAffiliateUpdated={fetchAffiliates}
        affiliate={selectedAffiliate}
      />
       <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'affilié "{selectedAffiliate?.nom}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Stack spacing={3}>
        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Affiliés</Typography>
          <Button startIcon={<SvgIcon><PlusIcon /></SvgIcon>} variant="contained" onClick={() => setIsCreateModalOpen(true)}>
            Créer un affilié
          </Button>
        </Stack>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <AffiliatesTable items={affiliates} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
        )}
      </Stack>
    </>
  );
}