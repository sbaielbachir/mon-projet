'use client';
import * as React from 'react';
import { Box, Typography, Stack, Button, SvgIcon, CircularProgress, Alert } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import { api } from '@/lib/api';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import { CreateProductModal } from '@/components/dashboard/products/create-product-modal';
import { EditProductModal } from '@/components/dashboard/products/edit-product-modal';

export interface Product {
  id: number;
  nom: string;
  duree_jours: number;
  prix: string;
  actif: boolean;
}

export default function ProductsPage(): React.JSX.Element {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/produits/');
      setProducts(response.data);
    } catch (err) {
      setError('Erreur lors de la récupération des produits');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.delete(`/produits/${productId}/`);
        fetchProducts();
      } catch (err) {
        setError('La suppression a échoué.');
      }
    }
  };

  return (
    <>
      <CreateProductModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onProductCreated={fetchProducts} />
      <EditProductModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onProductUpdated={fetchProducts} product={selectedProduct} />
      
      <Stack spacing={3}>
        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Produits</Typography>
          <Button startIcon={<SvgIcon><PlusIcon /></SvgIcon>} variant="contained" onClick={() => setIsCreateModalOpen(true)}>
            Ajouter un produit
          </Button>
        </Stack>
        {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : <ProductsTable items={products} onEdit={handleEdit} onDelete={handleDelete} />}
      </Stack>
    </>
  );
}