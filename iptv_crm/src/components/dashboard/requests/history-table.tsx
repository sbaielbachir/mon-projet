'use client';
import * as React from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip
} from '@mui/material';
import dayjs from 'dayjs';

interface HistoryItem {
  id: number;
  client: { user: { username: string; }; };
  statut: 'approuvee' | 'rejetee';
  date_demande: string;
}

interface HistoryTableProps {
  items: HistoryItem[];
}

export function HistoryTable({ items = [] }: HistoryTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Date de la demande</TableCell>
              <TableCell>Statut final</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">Aucune demande traitée dans l'historique.</TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow hover key={item.id}>
                <TableCell>{item.client.user.username}</TableCell>
                <TableCell>{dayjs(item.date_demande).format('DD/MM/YYYY HH:mm')}</TableCell>
                <TableCell>
                  <Chip
                    label={item.statut === 'approuvee' ? 'Approuvée' : 'Rejetée'}
                    color={item.statut === 'approuvee' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}