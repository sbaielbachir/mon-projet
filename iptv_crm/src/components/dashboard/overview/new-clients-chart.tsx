'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface NewClientsChartProps {
  data: { name: string; clients: number }[];
}

export function NewClientsChart({ data }: NewClientsChartProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Nouveaux clients" />
      <CardContent>
        <ResponsiveContainer height={350} width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid #ccc' }}>
                      <Typography>{`${payload[0].payload.name} : ${payload[0].value} client(s)`}</Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="clients" stroke="var(--mui-palette-secondary-main)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}