'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Package,
  Loader2,
} from 'lucide-react';
import { ProductResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface ProductsTableProps {
  products: ProductResponseDto[];
  isLoading: boolean;
  onEdit: (product: ProductResponseDto) => void;
  onDelete: (product: ProductResponseDto) => void;
}

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);

    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const };
    } else if (stock < 10) {
      return { label: 'Low Stock', variant: 'secondary' as const };
    } else {
      return { label: 'In Stock', variant: 'default' as const };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">
            Get started by creating your first product.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All ({products.length})
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            Active ({products.filter((p) => p.isActive).length})
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('inactive')}
          >
            Inactive ({products.filter((p) => !p.isActive).length})
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No products match your search criteria.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.category?.name || 'No Category'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatPrice(product.price)}
                      </div>
                      {product.discount && parseFloat(product.discount) > 0 && (
                        <div className="text-sm text-muted-foreground">
                          -{formatPrice(product.discount)} off
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.stock}</span>
                        <Badge
                          variant={stockStatus.variant}
                          className="text-xs"
                        >
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? 'default' : 'secondary'}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(product)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(product)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results summary */}
      {filteredProducts.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      )}
    </div>
  );
}
