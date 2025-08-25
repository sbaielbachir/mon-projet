'use client';
import * as React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Stack, TextField, Typography, Chip, Alert, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import type { Order } from '@/app/dashboard/orders/page'; // Assurez-vous que ce chemin est correct
import { api } from '@/lib/api'; // Importation de l'instance axios configurée

export default function OrderDetailsPage(): React.JSX.Element {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isApproving, setIsApproving] = React.useState(false);
  const [activationDetails, setActivationDetails] = React.useState('');
  const [activationStatus, setActivationStatus] = React.useState<{type: 'success' | 'error', message: string} | null>(null);

  React.useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // CORRECTION: Utilisation de l'instance 'api' qui inclut le token
        const response = await api.get(`/commandes/${id}/`);
        setOrder(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleApprove = async () => {
    if (!order) return;
    setActivationStatus(null);
    setIsApproving(true);
    try {
      // CORRECTION: Utilisation de l'instance 'api'
      const response = await api.post(`/commandes/${order.id}/approve/`, {
        details_connexion: activationDetails 
      });
      
      setActivationStatus({ type: 'success', message: response.data.message });
      // Mettre à jour l'état local de la commande
      setOrder(prev => prev ? { ...prev, statut_paiement: 'paye' } : null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || (err instanceof Error ? err.message : 'Erreur inconnue');
      setActivationStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsApproving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!order) return <Typography>Aucune commande trouvée.</Typography>;

  return (
    <Stack spacing={3}>
      <div>
        <Button onClick={() => router.back()}>&larr; Retour aux commandes</Button>
        <Typography variant="h4" mt={2}>Détails de la Commande #{order.id}</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid item lg={8} md={6} xs={12}>
          <Card>
            <CardHeader title="Informations sur la commande" />
            <Divider />
            <CardContent>
              <Stack spacing={2}>
                <InfoRow label="Client" value={order.client ? `${order.client.user.first_name} ${order.client.user.last_name}` : 'N/A'} />
                <InfoRow label="Email" value={order.client ? order.client.user.email : 'N/A'} />
                <InfoRow label="Produit" value={order.produit ? order.produit.nom : 'N/A'} />
                <InfoRow label="Montant" value={`${order.montant} $`} />
                <InfoRow label="Date" value={new Date(order.date_commande).toLocaleString('fr-CA')} />
                <InfoRow label="Statut" value={<Chip label={order.statut_paiement.replace('_', ' ')} color={order.statut_paiement === 'paye' ? 'success' : 'warning'} size="small" />} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={4} md={6} xs={12}>
          <Card>
            <CardHeader title="Actions" />
            <Divider />
            <CardContent>
              {order.statut_paiement === 'paye' ? (
                <Alert severity="success">Cet abonnement est déjà actif.</Alert>
              ) : (
                <Stack spacing={2}>
                  <Typography variant="body2">Entrez les détails de connexion (lien M3U, etc.) et approuvez la commande pour créer l'abonnement.</Typography>
                  <TextField fullWidth label="Détails de connexion" multiline rows={4} value={activationDetails} onChange={(e) => setActivationDetails(e.target.value)} variant="outlined" />
                  <Button variant="contained" color="primary" onClick={handleApprove} disabled={isApproving}>
                    {isApproving ? <CircularProgress size={24} /> : "Approuver et Créer l'Abonnement"}
                  </Button>
                  {activationStatus && (<Alert severity={activationStatus.type} sx={{mt: 2}}>{activationStatus.message}</Alert>)}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

// Composant utilitaire pour afficher les lignes d'information
function InfoRow({ label, value }: { label: string, value: React.ReactNode }): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
      <Typography variant="subtitle2" component="span" sx={{fontWeight: 600}}>{label}</Typography>
      <Typography variant="body1" component="span" sx={{ textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}
