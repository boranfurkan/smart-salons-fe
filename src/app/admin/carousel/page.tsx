'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CarouselTable } from '@/components/pages/admin/carousel/carousel-table';
import { CarouselCreateDialog } from '@/components/pages/admin/carousel/carousel-create-dialog';

export default function CarouselPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Carousel Management
          </h1>
          <p className="text-muted-foreground">
            Manage homepage carousel items and banners
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Carousel Item
        </Button>
      </div>

      <CarouselTable />

      <CarouselCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
