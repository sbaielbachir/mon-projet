import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import { paths } from '@/paths';

const statusMap = {
  ouvert: { label: 'Ouvert', color: 'warning' },
  en_cours: { label: 'En cours', color: 'primary' },
  ferme: { label: 'Fermé', color: 'success' },
} as const;

export function TicketsTable({ items = [] }: { items: any[] }): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ticket #</TableCell>
              <TableCell>Sujet</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Date de Création</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((ticket) => {
              const { label, color } = statusMap[ticket.statut] ?? { label: 'Inconnu', color: 'default' };
              return (
                <TableRow hover key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    <Link component={NextLink} href={paths.dashboard.tickets + `/${ticket.id}`}>
                      <Typography variant="subtitle2">{ticket.sujet}</Typography>
                    </Link>
                  </TableCell>
                  {/* CORRECTION : Affichage du nom d'utilisateur du client */}
                  <TableCell>{ticket.client?.user?.username || 'N/A'}</TableCell>
                  <TableCell>{dayjs(ticket.date_creation).format('DD/MM/YYYY')}</TableCell>
                  <TableCell><Chip label={label} color={color as any} size="small" /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}