'use client';
import * as React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react';

interface TotalRevenueProps {
  value: number;
}

export function TotalRevenue({ value }: TotalRevenueProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">Revenu Total</Typography>
              <Typography variant="h4">{value.toFixed(2)} $</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CurrencyDollarIcon />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}