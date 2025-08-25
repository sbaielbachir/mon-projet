'use client';
import * as React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { Users as UsersIcon } from '@phosphor-icons/react';

interface TotalClientsProps {
  value: number;
}

export function TotalClients({ value }: TotalClientsProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">Clients Totaux</Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UsersIcon />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}