import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Pencil as PencilIcon, Trash as TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface Subscription {
  id: number;
  client: { user: { username: string } };
  produit: { nom: string };
  date_debut: string;
  date_fin: string;
  statut: 'actif' | 'expire' | 'suspendu';
  details_connexion: string | null; // Ajout de ce champ
}

interface SubscriptionsTableProps {
  count?: number;
  items?: Subscription[];
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page?: number;
  rowsPerPage?: number;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscriptionId: number) => void;
}

const statusMap = {
  actif: { label: 'Actif', color: 'success' },
  expire: { label: 'Expiré', color: 'error' },
  suspendu: { label: 'Suspendu', color: 'warning' },
} as const;

export function SubscriptionsTable({
  count = 0,
  items = [],
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  page = 0,
  rowsPerPage = 0,
  onEdit,
  onDelete,
}: SubscriptionsTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Produit</TableCell>
              <TableCell>Date de Début</TableCell>
              <TableCell>Date de Fin</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Détails Connexion</TableCell> {/* Nouvelle colonne */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((subscription) => {
              const { label, color } = statusMap[subscription.statut] ?? { label: 'Inconnu', color: 'default' };
              return (
                <TableRow hover key={subscription.id}>
                  <TableCell><Typography variant="subtitle2">{subscription.client.user.username}</Typography></TableCell>
                  <TableCell>{subscription.produit.nom}</TableCell>
                  <TableCell>{dayjs(subscription.date_debut).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{dayjs(subscription.date_fin).format('DD/MM/YYYY')}</TableCell>
                  <TableCell><Chip label={label} color={color as any} size="small" /></TableCell>
                  {/* Affichage des détails de connexion */}
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                      {subscription.details_connexion || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton onClick={() => onEdit(subscription)}><SvgIcon><PencilIcon /></SvgIcon></IconButton>
                      <IconButton onClick={() => onDelete(subscription.id)}><SvgIcon color="error"><TrashIcon /></SvgIcon></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
