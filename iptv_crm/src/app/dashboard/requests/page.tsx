'use client';
import * as React from 'react';
import { Box, Typography, Stack, CircularProgress, Alert, Tabs, Tab } from '@mui/material';
import { api } from '@/lib/api';
import { RequestsTable } from '@/components/dashboard/requests/requests-table';
import { HistoryTable } from '@/components/dashboard/requests/history-table'; // Nouveau composant

interface AffiliateRequest {
  id: number;
  client: {
    id: number;
    user: {
      username: string;
      first_name: string;
      last_name: string;
    };
  };
  motivations: string;
  site_web: string;
  statut: string;
  date_demande: string;
}

export default function AffiliateRequestsPage(): React.JSX.Element {
  const [requests, setRequests] = React.useState<AffiliateRequest[]>([]);
  const [history, setHistory] = React.useState<AffiliateRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTab, setCurrentTab] = React.useState('pending');

  const fetchRequests = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // On charge les deux listes en parallèle
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/affiliate-requests/', { params: { statut: 'en_attente' } }),
        api.get('/affiliate-requests/', { params: { statut: 'history' } })
      ]);
      setRequests(pendingRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Erreur de récupération des demandes:", err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des demandes');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Demandes d'affiliation</Typography>
      
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="En attente" value="pending" />
        <Tab label="Historique" value="history" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {currentTab === 'pending' && <RequestsTable items={requests} onRequestProcessed={fetchRequests} />}
          {currentTab === 'history' && <HistoryTable items={history} />}
        </>
      )}
    </Stack>
  );
}