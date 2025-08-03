'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  User,
  Mail,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewsletterSubscriptionResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { NewsletterEditDialog } from './newsletter-edit-dialog';
import { NewsletterDeleteDialog } from './newsletter-delete-dialog';

interface NewsletterTableProps {
  subscriptions: NewsletterSubscriptionResponseDto[];
  onRefetch: () => void;
}

export function NewsletterTable({
  subscriptions,
  onRefetch,
}: NewsletterTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [editingSubscription, setEditingSubscription] =
    useState<NewsletterSubscriptionResponseDto | null>(null);
  const [deletingSubscription, setDeletingSubscription] =
    useState<NewsletterSubscriptionResponseDto | null>(null);

  // Filter subscriptions based on search and filters
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = subscription.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && subscription.isActive) ||
      (selectedStatus === 'inactive' && !subscription.isActive);

    const matchesUserType =
      selectedUserType === 'all' ||
      (selectedUserType === 'registered' && subscription.userId) ||
      (selectedUserType === 'guest' && !subscription.userId);

    return matchesSearch && matchesStatus && matchesUserType;
  });

  // Sort by creation date (newest first)
  const sortedSubscriptions = filteredSubscriptions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedUserType} onValueChange={setSelectedUserType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="User Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedSubscriptions.length} of {subscriptions.length}{' '}
        subscriptions
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ||
                    selectedStatus !== 'all' ||
                    selectedUserType !== 'all'
                      ? 'No subscriptions match your filters'
                      : 'No newsletter subscriptions found'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{subscription.email}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {subscription.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {subscription.userId ? (
                        <>
                          <User className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            Registered
                          </span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-500">
                            Guest
                          </span>
                        </>
                      )}
                    </div>
                    {subscription.userId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        User: {String(subscription.userId).slice(0, 8)}...
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={subscription.isActive ? 'default' : 'secondary'}
                      className={
                        subscription.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-600'
                      }
                    >
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(subscription.createdAt).toLocaleTimeString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(subscription.updatedAt).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(subscription.updatedAt).toLocaleTimeString()}
                    </p>
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
                          onClick={() => setEditingSubscription(subscription)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingSubscription(subscription)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Edit Dialog */}
      {editingSubscription && (
        <NewsletterEditDialog
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open: boolean) =>
            !open && setEditingSubscription(null)
          }
          onClose={() => setEditingSubscription(null)}
          onRefetch={onRefetch}
        />
      )}

      {/* Delete Dialog */}
      {deletingSubscription && (
        <NewsletterDeleteDialog
          subscription={deletingSubscription}
          open={!!deletingSubscription}
          onOpenChange={(open: boolean) =>
            !open && setDeletingSubscription(null)
          }
          onClose={() => setDeletingSubscription(null)}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
}
