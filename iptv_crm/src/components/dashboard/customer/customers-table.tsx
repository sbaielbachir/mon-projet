// src/components/dashboard/customer/customers-table.tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Customer {
  id: number;
  user: User;
  telephone: string | null;
  date_creation: string;
}

interface CustomersTableProps {
  count?: number;
  items?: Customer[];
  onPageChange?: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page?: number;
  rowsPerPage?: number;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: number) => void;
}

export function CustomersTable({
  count = 0,
  items = [],
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  page = 0,
  rowsPerPage = 0,
  onEdit,
  onDelete,
}: CustomersTableProps): React.JSX.Element {
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((customer) => {
              return (
                <TableRow hover key={customer.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{customer.user.username}</Typography>
                  </TableCell>
                  <TableCell>{customer.user.email}</TableCell>
                  <TableCell>{customer.telephone || 'Non fourni'}</TableCell>
                  <TableCell>{dayjs(customer.date_creation).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Stack direction="row">
                      <IconButton onClick={() => onEdit(customer)}>
                        <SvgIcon><PencilIcon /></SvgIcon>
                      </IconButton>
                      <IconButton onClick={() => onDelete(customer.id)}>
                        <SvgIcon color="error"><TrashIcon /></SvgIcon>
                      </IconButton>
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