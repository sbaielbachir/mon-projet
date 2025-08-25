'use client';
import * as React from 'react';
import { Box, Container, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { TotalRevenue } from '@/components/dashboard/overview/total-revenue';
import { ActiveSubscriptions } from '@/components/dashboard/overview/active-subscriptions';
import { TotalClients } from '@/components/dashboard/overview/total-clients';
import { NewOrders } from '@/components/dashboard/overview/new-orders';
import { RevenueChart } from '@/components/dashboard/overview/revenue-chart';
import { NewClientsChart } from '@/components/dashboard/overview/new-clients-chart';
import { api } from '@/lib/api';
import { MrrStat } from '@/components/dashboard/mrr-stat'; // <-- 1. AJOUT DE L'IMPORT

interface DashboardStats {
  total_revenue: number;
  total_clients: number;
  active_subscriptions: number;
  new_orders_this_month: number;
  chart_data: { name: string; revenu: number; clients: number }[];
}

export default function Page(): React.JSX.Element {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/dashboard-stats/');
        setStats(response.data);
      } catch (err) {
        setError("Erreur lors de la récupération des statistiques.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 4 }}>Tableau de bord</Typography>
        <Grid container spacing={3}>
          {/* -- NOUVELLE CARTE AJOUTÉE -- */}
          <Grid item lg={3} sm={6} xs={12}>
            <MrrStat />
          </Grid>
          {/* -- VOS CARTES EXISTANTES -- */}
          <Grid item lg={3} sm={6} xs={12}>
            <TotalRevenue value={stats?.total_revenue ?? 0} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <TotalClients value={stats?.total_clients ?? 0} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <ActiveSubscriptions value={stats?.active_subscriptions ?? 0} />
          </Grid>
          <Grid item lg={3} sm={6} xs={12}>
            <NewOrders value={stats?.new_orders_this_month ?? 0} />
          </Grid>
          <Grid item lg={8} xs={12}>
            <RevenueChart data={stats?.chart_data ?? []} />
          </Grid>
          <Grid item lg={4} xs={12}>
            <NewClientsChart data={stats?.chart_data ?? []} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}