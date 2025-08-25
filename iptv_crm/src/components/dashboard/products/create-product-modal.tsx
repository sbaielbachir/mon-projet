'use client';
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, FormControlLabel, Switch, Alert, CircularProgress } from '@mui/material';
import { api } from '@/lib/api';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

export function CreateProductModal({ open, onClose, onProductCreated }: CreateProductModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({ nom: '', duree_jours: 30, prix: '', actif: true });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/produits/', formData);
      onProductCreated();
      onClose();
    } catch (err) {
      setError('La création a échoué.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un nouveau produit</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField name="nom" label="Nom du produit" fullWidth onChange={handleChange} />
          <TextField name="duree_jours" label="Durée (en jours)" type="number" fullWidth onChange={handleChange} />
          <TextField name="prix" label="Prix" type="number" fullWidth onChange={handleChange} />
          <FormControlLabel control={<Switch name="actif" checked={formData.actif} onChange={handleChange} />} label="Actif" />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}