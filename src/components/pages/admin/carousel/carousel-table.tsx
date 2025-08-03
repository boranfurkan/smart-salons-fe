'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { keepPreviousData } from '@tanstack/react-query';
import { useAdminControllerGetAllCarouselItems } from '@/lib/api/generated/admin/admin';
import { CarouselItemResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { CarouselEditDialog } from './carousel-edit-dialog';
import { CarouselDeleteDialog } from './carousel-delete-dialog';
import Image from 'next/image';

interface CarouselTableProps {
  onRefresh?: () => void;
}

export function CarouselTable({ onRefresh }: CarouselTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCarouselItem, setSelectedCarouselItem] =
    useState<CarouselItemResponseDto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: carouselItems = [],
    isLoading,
    error,
    refetch,
  } = useAdminControllerGetAllCarouselItems({
    query: {
      placeholderData: keepPreviousData,
    },
  });

  const filteredCarouselItems = carouselItems
    .filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.description || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && item.isActive) ||
        (statusFilter === 'inactive' && !item.isActive);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.order - b.order); // Sort by order

  const handleEditCarouselItem = (item: CarouselItemResponseDto) => {
    setSelectedCarouselItem(item);
    setEditDialogOpen(true);
  };

  const handleDeleteCarouselItem = (item: CarouselItemResponseDto) => {
    setSelectedCarouselItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedCarouselItem(null);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    refetch();
    onRefresh?.();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">
            Failed to load carousel items. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Carousel Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search carousel items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:w-[300px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Button</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading carousel items...
                    </TableCell>
                  </TableRow>
                ) : filteredCarouselItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No carousel items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCarouselItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{item.order}</span>
                          <div className="flex flex-col gap-1">
                            <ArrowUp className="h-3 w-3 text-muted-foreground" />
                            <ArrowDown className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative w-16 h-10 bg-muted rounded overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            onError={() => {
                              console.error('Image failed to load');
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                          {String(item.description || 'No description')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.buttonText && item.buttonLink ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {String(item.buttonText)}
                            </div>
                            <div className="text-muted-foreground truncate max-w-[100px]">
                              {String(item.buttonLink)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            No button
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.isActive ? 'default' : 'secondary'}
                        >
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(item.createdAt).toLocaleTimeString()}
                          </div>
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
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(item.imageUrl, '_blank')
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Image
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditCarouselItem(item)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCarouselItem(item)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedCarouselItem && (
        <>
          <CarouselEditDialog
            carouselItem={selectedCarouselItem}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onClose={handleDialogClose}
          />
          <CarouselDeleteDialog
            carouselItem={selectedCarouselItem}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onClose={handleDialogClose}
          />
        </>
      )}
    </>
  );
}
