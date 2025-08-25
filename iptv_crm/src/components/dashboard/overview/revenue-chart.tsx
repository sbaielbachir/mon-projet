'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
  data: { name: string; revenu: number }[];
}

export function RevenueChart({ data }: RevenueChartProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader title="Revenus des 6 derniers mois" />
      <CardContent>
        <ResponsiveContainer height={350} width="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Box sx={{ bgcolor: 'background.paper', p: 1, border: '1px solid #ccc' }}>
                      <Typography>{`${payload[0].payload.name} : ${payload[0].value?.toFixed(2)} $`}</Typography>
                    </Box>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="revenu" fill="var(--mui-palette-primary-main)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}