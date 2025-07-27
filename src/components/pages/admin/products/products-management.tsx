'use client';

import { useState } from 'react';
import { useAdminControllerGetAllProducts } from '@/lib/api/generated/admin/admin';
import { ProductsTable } from './products-table';
import { ProductCreateDialog } from './product-create-dialog';
import { ProductEditDialog } from './product-edit-dialog';
import { ProductDeleteDialog } from './product-delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Loader2 } from 'lucide-react';
import { ProductResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export function ProductsManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductResponseDto | null>(null);
  const [deletingProduct, setDeletingProduct] =
    useState<ProductResponseDto | null>(null);

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useAdminControllerGetAllProducts();

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingProduct(null);
    refetch();
  };

  const handleDeleteSuccess = () => {
    setDeletingProduct(null);
    refetch();
  };

  const handleEdit = (product: ProductResponseDto) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: ProductResponseDto) => {
    setDeletingProduct(product);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Products Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Error loading products
              </h3>
              <p className="text-muted-foreground">
                There was an error loading your products. Please try again.
              </p>
              <Button onClick={() => refetch()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Products Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and pricing.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                products?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                products?.filter((p) => p.isActive)?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                products?.filter((p) => p.stock < 10)?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                products?.filter((p) => p.stock === 0)?.length || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductsTable
            products={products || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />

      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open: boolean) => !open && setEditingProduct(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingProduct && (
        <ProductDeleteDialog
          product={deletingProduct}
          open={!!deletingProduct}
          onOpenChange={(open: boolean) => !open && setDeletingProduct(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
