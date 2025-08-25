import * as React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Box, CircularProgress, Alert,
  Stack, OutlinedInput, Typography
} from '@mui/material';
import { api } from '@/lib/api';

interface Affiliate {
  id: number;
  nom: string;
  type_affilie: 'CLIENT' | 'EVENEMENT';
  client: { user: { username: string; }; } | null;
  code_affiliation: string;
  pourcentage_commission: string;
}

interface EditAffiliateModalProps {
  open: boolean;
  onClose: () => void;
  onAffiliateUpdated: () => void;
  affiliate: Affiliate | null;
}

export function EditAffiliateModal({ open, onClose, onAffiliateUpdated, affiliate }: EditAffiliateModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    nom: '',
    code_affiliation: '',
    pourcentage_commission: ''
  });
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (affiliate) {
      setFormData({
        nom: affiliate.nom,
        code_affiliation: affiliate.code_affiliation,
        pourcentage_commission: parseFloat(affiliate.pourcentage_commission).toString()
      });
    }
  }, [affiliate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!affiliate) return;
    setLoading(true);
    setError(null);
    
    const payload = {
      ...formData,
      pourcentage_commission: parseFloat(formData.pourcentage_commission)
    };

    try {
      await api.patch(`/affilies/${affiliate.id}/`, payload);
      onAffiliateUpdated();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "La mise à jour a échoué.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!affiliate) return <></>;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier l'affilié : {affiliate.nom}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="body2">
                Type : <strong>{affiliate.type_affilie}</strong> {affiliate.client ? `(${affiliate.client.user.username})` : ''}
            </Typography>

            <FormControl fullWidth>
                <InputLabel>Nom / Campagne</InputLabel>
                <OutlinedInput 
                    label="Nom / Campagne" 
                    name="nom"
                    value={formData.nom} 
                    onChange={handleChange} 
                    disabled={affiliate.type_affilie === 'CLIENT'}
                />
            </FormControl>
            
            <FormControl fullWidth>
                <InputLabel>Code d'affiliation</InputLabel>
                <OutlinedInput 
                    label="Code d'affiliation"
                    name="code_affiliation"
                    value={formData.code_affiliation} 
                    onChange={handleChange} 
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel>Pourcentage de commission (%)</InputLabel>
                <OutlinedInput 
                    label="Pourcentage de commission (%)" 
                    name="pourcentage_commission"
                    type="number" 
                    value={formData.pourcentage_commission} 
                    onChange={handleChange} 
                    inputProps={{ min: 0, max: 100, step: "0.01" }}
                />
            </FormControl>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
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