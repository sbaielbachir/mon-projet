'use client';
import * as React from 'react';
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography, Chip, IconButton, Tooltip, Stack } from '@mui/material';
import { Pencil as PencilIcon, Trash as TrashIcon } from '@phosphor-icons/react';
import type { Product } from '@/app/dashboard/products/page';

interface ProductsTableProps {
  items: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductsTable({ items = [], onEdit, onDelete }: ProductsTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Durée (jours)</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((product) => (
              <TableRow hover key={product.id}>
                <TableCell><Typography variant="subtitle2">{product.nom}</Typography></TableCell>
                <TableCell>{product.duree_jours}</TableCell>
                <TableCell>{parseFloat(product.prix).toFixed(2)} $</TableCell>
                <TableCell>
                  <Chip label={product.actif ? 'Actif' : 'Inactif'} color={product.actif ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Stack direction="row">
                    <Tooltip title="Modifier"><IconButton onClick={() => onEdit(product)}><PencilIcon /></IconButton></Tooltip>
                    <Tooltip title="Supprimer"><IconButton color="error" onClick={() => onDelete(product.id)}><TrashIcon /></IconButton></Tooltip>
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