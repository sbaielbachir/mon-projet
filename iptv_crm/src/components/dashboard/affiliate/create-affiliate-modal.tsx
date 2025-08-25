import * as React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
  InputLabel, Select, MenuItem, Box, CircularProgress, Alert,
  Stack, RadioGroup, FormControlLabel, Radio, FormLabel, OutlinedInput
} from '@mui/material';
import { api } from '@/lib/api';

interface Client {
  id: number;
  user: {
    username: string;
  };
}

interface CreateAffiliateModalProps {
  open: boolean;
  onClose: () => void;
  onAffiliateCreated: () => void;
}

export function CreateAffiliateModal({ open, onClose, onAffiliateCreated }: CreateAffiliateModalProps): React.JSX.Element {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [affiliateType, setAffiliateType] = React.useState<'CLIENT' | 'EVENEMENT'>('CLIENT');
  
  const [selectedClientId, setSelectedClientId] = React.useState<string>('');
  const [eventName, setEventName] = React.useState('');
  const [eventCode, setEventCode] = React.useState('');
  const [commission, setCommission] = React.useState('10');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && affiliateType === 'CLIENT') {
      const fetchClients = async () => {
        try {
          const response = await api.get('/clients/'); 
          setClients(response.data);
        } catch (err) {
          console.error("Erreur de récupération des clients", err);
        }
      };
      fetchClients();
    }
  }, [open, affiliateType]);

  const resetForm = () => {
    setAffiliateType('CLIENT');
    setSelectedClientId('');
    setEventName('');
    setEventCode('');
    setCommission('10');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    const payload: any = {
        type_affilie: affiliateType,
        pourcentage_commission: parseFloat(commission)
    };

    if (affiliateType === 'CLIENT') {
        if (!selectedClientId) {
            setError("Veuillez sélectionner un client.");
            setLoading(false);
            return;
        }
        payload.client_id = Number(selectedClientId);
    } else { // EVENEMENT
        if (!eventName) {
            setError("Le nom de la campagne est requis.");
            setLoading(false);
            return;
        }
        payload.nom = eventName;
        if (eventCode) {
            payload.code_affiliation = eventCode;
        }
    }

    try {
      await api.post('/affilies/create/', payload);
      onAffiliateCreated();
      handleClose();
    } catch (err: any) {
      // *** CORRECTIF GESTION D'ERREUR ***
      let errorMessage = "Une erreur est survenue.";
      if (err.response && err.response.data) {
          // Transformer l'objet d'erreur en une chaîne lisible
          errorMessage = Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer un nouvel affilié</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Type d'affilié</FormLabel>
                <RadioGroup row value={affiliateType} onChange={(e) => setAffiliateType(e.target.value as any)}>
                    <FormControlLabel value="CLIENT" control={<Radio />} label="Client existant" />
                    <FormControlLabel value="EVENEMENT" control={<Radio />} label="Événement / Publicité" />
                </RadioGroup>
            </FormControl>

            {affiliateType === 'CLIENT' ? (
                <FormControl fullWidth>
                    <InputLabel>Client</InputLabel>
                    <Select value={selectedClientId} label="Client" onChange={(e) => setSelectedClientId(e.target.value)}>
                        {clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>{client.user.username}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : (
                <>
                    <FormControl fullWidth>
                        <InputLabel>Nom de la campagne</InputLabel>
                        <OutlinedInput label="Nom de la campagne" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Code personnalisé (facultatif)</InputLabel>
                        <OutlinedInput label="Code personnalisé (facultatif)" placeholder="Ex: PROMO2025" value={eventCode} onChange={(e) => setEventCode(e.target.value)} />
                    </FormControl>
                </>
            )}

            <FormControl fullWidth>
                <InputLabel>Pourcentage de commission (%)</InputLabel>
                <OutlinedInput 
                    label="Pourcentage de commission (%)" 
                    type="number" 
                    value={commission} 
                    onChange={(e) => setCommission(e.target.value)} 
                    inputProps={{ min: 0, max: 100, step: "0.01" }}
                />
            </FormControl>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}