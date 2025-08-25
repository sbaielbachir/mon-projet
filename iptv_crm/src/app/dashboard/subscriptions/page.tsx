'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { api } from '@/lib/api'; // CORRECTION

import { SubscriptionsTable } from '@/components/dashboard/subscription/subscriptions-table';
import { AddSubscriptionModal } from '@/components/dashboard/subscription/add-subscription-modal';
import { EditSubscriptionModal } from '@/components/dashboard/subscription/edit-subscription-modal';

interface Subscription {
  id: number;
  client: { user: { username: string } };
  produit: { nom: string };
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'expire' | 'suspendu';
  details_connexion: string | null;
}

export default function Page(): React.JSX.Element {
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [clients, setClients] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState<Subscription | null>(null);

  const fetchData = async () => {
    try {
      // CORRECTION
      const [subsRes, clientsRes, productsRes] = await Promise.all([
        api.get('/abonnements/'),
        api.get('/clients/'),
        api.get('/produits/')
      ]);
      setSubscriptions(subsRes.data);
      setClients(clientsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (subscriptionId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet abonnement ?")) {
      try {
        // CORRECTION
        await api.delete(`/abonnements/${subscriptionId}/`);
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'abonnement:", error);
      }
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsEditModalOpen(true);
  };

  const handleSubscriptionUpdated = () => {
    fetchData();
    setIsEditModalOpen(false);
  };

  const paginatedSubscriptions = subscriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AddSubscriptionModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubscriptionAdded={fetchData}
        clients={clients}
        products={products}
      />
      <EditSubscriptionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubscriptionUpdated={handleSubscriptionUpdated}
        subscription={selectedSubscription}
      />
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Abonnements</Typography>
          </Stack>
          <div>
            <Button startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>} variant="contained" onClick={() => setIsAddModalOpen(true)}>
              Ajouter un Abonnement
            </Button>
          </div>
        </Stack>
        <SubscriptionsTable
          count={subscriptions.length}
          items={paginatedSubscriptions}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Stack>
    </>
  );
}