'use client';
import * as React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, FormControlLabel, Switch, Alert, CircularProgress } from '@mui/material';
import { api } from '@/lib/api';
import type { Product } from '@/app/dashboard/products/page';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product | null;
}

export function EditProductModal({ open, onClose, onProductUpdated, product }: EditProductModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({ nom: '', duree_jours: 0, prix: '', actif: true });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (product) {
      setFormData({
        nom: product.nom,
        duree_jours: product.duree_jours,
        prix: product.prix,
        actif: product.actif,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      await api.patch(`/produits/${product.id}/`, formData);
      onProductUpdated();
      onClose();
    } catch (err) {
      setError('La mise à jour a échoué.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <></>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le produit</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField name="nom" label="Nom du produit" fullWidth value={formData.nom} onChange={handleChange} />
          <TextField name="duree_jours" label="Durée (en jours)" type="number" fullWidth value={formData.duree_jours} onChange={handleChange} />
          <TextField name="prix" label="Prix" type="number" fullWidth value={formData.prix} onChange={handleChange} />
          <FormControlLabel control={<Switch name="actif" checked={formData.actif} onChange={handleChange} />} label="Actif" />
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Sauvegarder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}