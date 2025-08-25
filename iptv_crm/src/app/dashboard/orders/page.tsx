'use client';
import * as React from 'react';
import { Box, Typography, Stack, CircularProgress, Alert } from '@mui/material';
import { OrdersTable } from '@/components/dashboard/order/orders-table';
import { api } from '@/lib/api';

// Définition des types pour une meilleure autocomplétion et sécurité
interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface Client {
  id: number;
  user: User;
}

interface Product {
  id: number;
  nom: string;
}

export interface Order {
  id: number;
  client: Client;
  produit: Product;
  montant: string;
  date_commande: string;
  statut_paiement: 'en_attente' | 'paye' | 'annule';
}

export default function OrdersPage(): React.JSX.Element {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fonction pour récupérer les commandes depuis l'API
  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Réinitialiser l'erreur à chaque tentative
      
      const response = await api.get('/commandes/');
      
      setOrders(response.data);
    } catch (err) {
      console.error("Erreur de récupération des commandes:", err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Chargement des commandes...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Commandes</Typography>
      </Box>
      <OrdersTable items={orders} onRefresh={fetchOrders} />
    </Stack>
  );
}