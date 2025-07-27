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
import { useAdminControllerGetAllCategoriesIncludingInactive } from '@/lib/api/generated/admin/admin';
import { CategoriesTable } from './categories-table';
import { CategoryCreateDialog } from './category-create-dialog';
import { CategoryEditDialog } from './category-edit-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { CategoryResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export function CategoriesManagement() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponseDto | null>(null);

  const { data: categories, refetch } =
    useAdminControllerGetAllCategoriesIncludingInactive();

  const totalCategories = categories?.length || 0;
  const activeCategories =
    categories?.filter((c: CategoryResponseDto) => c.isActive).length || 0;
  const inactiveCategories = totalCategories - activeCategories;

  const handleEditCategory = (category: CategoryResponseDto) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  const handleDeleteCategory = (category: CategoryResponseDto) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    refetch();
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">
            Manage product categories for your salon
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              All product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              Visible to customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {inactiveCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              Hidden from customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            View and manage all product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesTable
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CategoryCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      <CategoryEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleDialogSuccess}
        category={selectedCategory}
      />

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDialogSuccess}
        category={selectedCategory}
      />
    </div>
  );
}
