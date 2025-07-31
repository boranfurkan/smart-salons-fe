'use client';

import { useState } from 'react';
import { MoreHorizontal, Edit, Trash2, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAdminControllerGetAllColorVariants } from '@/lib/api/generated/admin/admin';
import { ColorVariantResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface ColorVariantsTableProps {
  onEditColorVariant: (colorVariant: ColorVariantResponseDto) => void;
  onDeleteColorVariant: (colorVariant: ColorVariantResponseDto) => void;
}

export function ColorVariantsTable({
  onEditColorVariant,
  onDeleteColorVariant,
}: ColorVariantsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<
    'all' | 'in-stock' | 'out-of-stock'
  >('all');

  const { data: colorVariants, isLoading } =
    useAdminControllerGetAllColorVariants();

  // Filter color variants based on search and stock status
  const filteredColorVariants = (colorVariants || []).filter((variant) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      variant.name.toLowerCase().includes(searchLower) ||
      variant.hexCode.toLowerCase().includes(searchLower) ||
      (variant.sku && variant.sku.toLowerCase().includes(searchLower)) ||
      (variant.product?.name &&
        variant.product.name.toLowerCase().includes(searchLower)) ||
      (variant.product?.slug &&
        variant.product.slug.toLowerCase().includes(searchLower));

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && variant.stock > 0) ||
      (stockFilter === 'out-of-stock' && variant.stock === 0);

    return matchesSearch && matchesStock;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock <= 10)
      return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-64 bg-muted animate-pulse rounded-md" />
            <div className="h-9 w-32 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Hex Code</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-6 w-6 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by variant name, SKU, product name, or hex code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select
            value={stockFilter}
            onValueChange={(value: 'all' | 'in-stock' | 'out-of-stock') =>
              setStockFilter(value)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredColorVariants.length} of {colorVariants?.length || 0}{' '}
          variants
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredColorVariants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  {searchTerm || stockFilter !== 'all' ? (
                    <div className="text-muted-foreground">
                      No color variants found matching your filters.
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div className="text-muted-foreground">
                        No color variants found. Create your first color variant
                        to get started.
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredColorVariants.map((variant) => {
                const stockStatus = getStockStatus(variant.stock);
                return (
                  <TableRow key={variant.id}>
                    <TableCell>
                      {variant.images?.find((img) => img.isPrimary) ||
                      variant.images?.[0] ? (
                        <img
                          src={
                            (
                              variant.images?.find((img) => img.isPrimary) ||
                              variant.images?.[0]
                            )?.url
                          }
                          alt={
                            (
                              variant.images?.find((img) => img.isPrimary) ||
                              variant.images?.[0]
                            )?.altText || variant.name
                          }
                          className="w-10 h-10 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No img
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.hexCode }}
                        title={variant.hexCode}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {variant.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {variant.sku || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {variant.price ? (
                        <div className="flex flex-col">
                          <span className="font-medium">${variant.price}</span>
                          {variant.discount && (
                            <span className="text-xs text-green-600">
                              -${variant.discount}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          variant.stock <= 10 && variant.stock > 0
                            ? 'text-orange-600 font-medium'
                            : ''
                        }
                      >
                        {variant.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {variant.product ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {variant.product.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {variant.product.slug}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(variant.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEditColorVariant(variant)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteColorVariant(variant)}
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
    </div>
  );
}
