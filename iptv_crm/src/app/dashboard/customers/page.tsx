'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { api } from '@/lib/api'; // CORRECTION

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { AddCustomerModal } from '@/components/dashboard/customer/add-customer-modal';
import { EditCustomerModal } from '@/components/dashboard/customer/edit-customer-modal';

interface Customer {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  telephone: string | null;
  date_creation: string;
}

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      // CORRECTION
      const response = await api.get('/clients/');
      setCustomers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (customerId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.")) {
      try {
        // CORRECTION
        await api.delete(`/clients/${customerId}/`);
        fetchCustomers();
      } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
      }
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const paginatedCustomers = customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <AddCustomerModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onCustomerAdded={fetchCustomers} />
      <EditCustomerModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onCustomerUpdated={fetchCustomers} customer={selectedCustomer} />
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Clients</Typography>
          </Stack>
          <div>
            <Button startIcon={<SvgIcon fontSize="small"><PlusIcon /></SvgIcon>} variant="contained" onClick={() => setIsAddModalOpen(true)}>
              Ajouter
            </Button>
          </div>
        </Stack>
        <CustomersTable
          count={customers.length}
          items={paginatedCustomers}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          page={page}
          rowsPerPage={rowsPerPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Stack>
    </>
  );
}