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
import axios from 'axios';
import dayjs from 'dayjs';

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubscriptionAdded: () => void;
  clients: any[];
  products: any[];
}

export function AddSubscriptionModal({ open, onClose, onSubscriptionAdded, clients, products }: AddSubscriptionModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    client_id: '',
    produit_id: '',
    details_connexion: ''
  });

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedProduct = products.find(p => p.id === Number(formData.produit_id));
    if (!selectedProduct) return;

    const payload = {
      ...formData,
      client_id: Number(formData.client_id),
      produit_id: Number(formData.produit_id),
      date_debut: dayjs().format('YYYY-MM-DD'),
      date_fin: dayjs().add(selectedProduct.duree_jours, 'day').format('YYYY-MM-DD'),
      statut: 'actif'
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/abonnements/', payload);
      onSubscriptionAdded();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'abonnement:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un nouvel abonnement</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <FormLabel>Client</FormLabel>
              <Select name="client_id" value={formData.client_id} onChange={handleChange}>
                {clients.map(client => <MenuItem key={client.id} value={client.id}>{client.user.username}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <FormLabel>Produit</FormLabel>
              <Select name="produit_id" value={formData.produit_id} onChange={handleChange}>
                {products.map(product => <MenuItem key={product.id} value={product.id}>{product.nom}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Détails de connexion (Lien M3U, etc.)</FormLabel>
              <Input name="details_connexion" onChange={handleChange} multiline rows={4} />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained">Ajouter</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
