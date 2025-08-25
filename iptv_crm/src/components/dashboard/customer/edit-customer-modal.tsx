// src/components/dashboard/customer/edit-customer-modal.tsx
import * as React from 'react';
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

interface User {
  id: number;
  username: string;
  email: string;
}

interface Customer {
  id: number;
  user: User;
  telephone: string | null;
}

interface EditCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCustomerUpdated: () => void;
  customer: Customer | null;
}

export function EditCustomerModal({ open, onClose, onCustomerUpdated, customer }: EditCustomerModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    telephone: ''
  });

  React.useEffect(() => {
    if (customer) {
      setFormData({
        username: customer.user.username,
        email: customer.user.email,
        telephone: customer.telephone || ''
      });
    }
  }, [customer]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customer) return;

    const payload = {
      user: {
        username: formData.username,
        email: formData.email,
      },
      telephone: formData.telephone
    };
    try {
      await axios.put(`http://127.0.0.1:8000/api/clients/${customer.id}/`, payload);
      onCustomerUpdated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le client</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input name="username" value={formData.username} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Téléphone</FormLabel>
              <Input name="telephone" value={formData.telephone} onChange={handleChange} />
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