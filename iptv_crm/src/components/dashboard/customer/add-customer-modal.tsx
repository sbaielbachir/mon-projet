// src/components/dashboard/customer/add-customer-modal.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import axios from 'axios';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
}

export function AddCustomerModal({ open, onClose, onCustomerAdded }: AddCustomerModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    telephone: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      user: {
        username: formData.username,
        email: formData.email,
        password: formData.password
      },
      telephone: formData.telephone
    };
    try {
      await axios.post('http://127.0.0.1:8000/api/clients/', payload);
      onCustomerAdded();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un nouveau client</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input name="username" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Mot de passe</FormLabel>
              <Input name="password" type="password" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Téléphone</FormLabel>
              <Input name="telephone" onChange={handleChange} />
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