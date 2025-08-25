import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack'; // <-- IMPORT AJOUTÉ ICI
import { Pencil as PencilIcon, Trash as TrashIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';

interface Affiliate {
  id: number;
  nom: string;
  type_affilie: 'CLIENT' | 'EVENEMENT';
  client: { user: { username: string; }; } | null;
  code_affiliation: string;
  pourcentage_commission: string;
  solde_commission: string;
  date_creation: string;
}

interface AffiliatesTableProps {
  items: Affiliate[];
  onEdit: (affiliate: Affiliate) => void;
  onDelete: (affiliate: Affiliate) => void;
}

export function AffiliatesTable({ items = [], onEdit, onDelete }: AffiliatesTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nom / Campagne</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Client Associé</TableCell>
              <TableCell>Code d'Affiliation</TableCell>
              <TableCell>Commission (%)</TableCell>
              <TableCell>Solde</TableCell>
              <TableCell>Date d'Inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((affiliate) => (
              <TableRow hover key={affiliate.id}>
                <TableCell>
                  <Typography variant="subtitle2">{affiliate.nom}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={affiliate.type_affilie === 'CLIENT' ? 'Client' : 'Événement'} 
                    color={affiliate.type_affilie === 'CLIENT' ? 'primary' : 'secondary'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{affiliate.client ? affiliate.client.user.username : 'N/A'}</TableCell>
                <TableCell>{affiliate.code_affiliation}</TableCell>
                <TableCell>{parseFloat(affiliate.pourcentage_commission).toFixed(2)}%</TableCell>
                <TableCell>{parseFloat(affiliate.solde_commission).toFixed(2)} $</TableCell>
                <TableCell>{dayjs(affiliate.date_creation).format('DD/MM/YYYY')}</TableCell>
                <TableCell>
                  <Stack direction="row">
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => onEdit(affiliate)}>
                        <PencilIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton color="error" onClick={() => onDelete(affiliate)}>
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}