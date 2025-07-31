'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAdminControllerGetAllColorVariants } from '@/lib/api/generated/admin/admin';
import { ColorVariantsTable } from './color-variants-table';
import { ColorVariantCreateDialog } from './color-variant-create-dialog';
import { ColorVariantEditDialog } from './color-variant-edit-dialog';
import { ColorVariantDeleteDialog } from './color-variant-delete-dialog';
import { ColorVariantResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export function ColorVariantsManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedColorVariant, setSelectedColorVariant] =
    useState<ColorVariantResponseDto | null>(null);

  const { data: colorVariants, refetch } =
    useAdminControllerGetAllColorVariants();

  const totalVariants = colorVariants?.length || 0;
  const inStockVariants =
    colorVariants?.filter(
      (variant: ColorVariantResponseDto) => variant.stock > 0
    ).length || 0;
  const outOfStockVariants = totalVariants - inStockVariants;

  const handleEditColorVariant = (colorVariant: ColorVariantResponseDto) => {
    setSelectedColorVariant(colorVariant);
    setEditDialogOpen(true);
  };

  const handleDeleteColorVariant = (colorVariant: ColorVariantResponseDto) => {
    setSelectedColorVariant(colorVariant);
    setDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refetch();
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedColorVariant(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Color Variants Management</h1>
          <p className="text-muted-foreground">
            Manage color variations for your products
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Color Variant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Variants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVariants}</div>
            <p className="text-xs text-muted-foreground">All color variants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inStockVariants}
            </div>
            <p className="text-xs text-muted-foreground">Available variants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockVariants}
            </div>
            <p className="text-xs text-muted-foreground">
              Unavailable variants
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Color Variants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Color Variants</CardTitle>
          <CardDescription>
            View and manage all color variants across your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ColorVariantsTable
            onEditColorVariant={handleEditColorVariant}
            onDeleteColorVariant={handleDeleteColorVariant}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ColorVariantCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      <ColorVariantEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleDialogSuccess}
        colorVariant={selectedColorVariant}
      />

      <ColorVariantDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDialogSuccess}
        colorVariant={selectedColorVariant}
      />
    </div>
  );
}
