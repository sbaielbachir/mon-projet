import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';

interface Subscription {
  id: number;
  client: { user: { username: string } };
  produit: { nom: string };
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'expire' | 'suspendu';
  details_connexion: string | null;
}

interface EditSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubscriptionUpdated: () => void;
  subscription: Subscription | null;
}

export function EditSubscriptionModal({ open, onClose, onSubscriptionUpdated, subscription }: EditSubscriptionModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    statut: 'actif',
    details_connexion: ''
  });

  React.useEffect(() => {
    if (subscription) {
      setFormData({
        statut: subscription.statut,
        details_connexion: subscription.details_connexion || ''
      });
    }
  }, [subscription]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subscription) return;

    try {
      // CORRECTION : On utilise PATCH pour une mise à jour partielle
      await axios.patch(`http://127.0.0.1:8000/api/abonnements/${subscription.id}/`, {
        statut: formData.statut,
        details_connexion: formData.details_connexion,
      });
      onSubscriptionUpdated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier l'abonnement de {subscription.client.user.username}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Produit: {subscription.produit.nom}</Typography>
            <FormControl fullWidth>
              <FormLabel>Statut</FormLabel>
              <Select name="statut" value={formData.statut} onChange={handleChange}>
                <MenuItem value="actif">Actif</MenuItem>
                <MenuItem value="expire">Expiré</MenuItem>
                <MenuItem value="suspendu">Suspendu</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Détails de connexion (Lien M3U, etc.)</FormLabel>
              <Input name="details_connexion" value={formData.details_connexion} onChange={handleChange} multiline rows={4} />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Sauvegarder</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}