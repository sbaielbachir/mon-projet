'use client';
import * as React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@phosphor-icons/react';

interface NewOrdersProps {
  value: number;
}

export function NewOrders({ value }: NewOrdersProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">Commandes (ce mois)</Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-error-main)', height: '56px', width: '56px' }}>
              <ShoppingCartIcon />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}