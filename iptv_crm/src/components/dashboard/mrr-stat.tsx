'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TrendUp as TrendUpIcon } from '@phosphor-icons/react';
import { api } from '@/lib/api'; // Assurez-vous que l'import est correct

export function MrrStat(): React.JSX.Element {
  const [mrr, setMrr] = React.useState({ amount: 0, diff: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMrr = async () => {
      try {
        setLoading(true);
        // L'URL est maintenant correcte
        const response = await api.get('/mrr-stats/'); 
        setMrr(response.data);
      } catch (err) {
        setError('Impossible de charger le MRR.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMrr();
  }, []);

  const positive = mrr.diff > 0;

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="overline">
            Revenu Mensuel Réc.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h4">
              {loading ? '...' : new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(mrr.amount)}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar
                sx={{
                  '--Avatar-size': '24px',
                  backgroundColor: positive ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)',
                  color: 'var(--mui-palette-success-contrastText)',
                }}
              >
                <TrendUpIcon fontSize="var(--icon-fontSize-sm)" />
              </Avatar>
              <Typography color={positive ? 'success.main' : 'error.main'} variant="body2">
                {mrr.diff}%
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}