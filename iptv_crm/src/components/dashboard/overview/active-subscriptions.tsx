'use client';
import * as React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { ListChecks as ListChecksIcon } from '@phosphor-icons/react';

interface ActiveSubscriptionsProps {
  value: number;
}

export function ActiveSubscriptions({ value }: ActiveSubscriptionsProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">Abonnements Actifs</Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <ListChecksIcon />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}