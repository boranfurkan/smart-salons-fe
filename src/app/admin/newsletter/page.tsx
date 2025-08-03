'use client';

import { Button } from '@/components/ui/button';
import { Download, Mail } from 'lucide-react';
import { useAdminControllerGetAllNewsletterSubscriptions } from '@/lib/api/generated/admin/admin';
import { NewsletterTable } from '@/components/pages/admin/newsletter/newsletter-table';

export default function NewsletterPage() {
  const {
    data: subscriptions,
    isLoading,
    error,
    refetch,
  } = useAdminControllerGetAllNewsletterSubscriptions();

  const handleExportSubscriptions = () => {
    if (!subscriptions || subscriptions.length === 0) {
      return;
    }

    // Create CSV content
    const headers = [
      'Email',
      'User ID',
      'Status',
      'Created Date',
      'Updated Date',
    ];
    const csvContent = [
      headers.join(','),
      ...subscriptions.map((sub) =>
        [
          sub.email,
          sub.userId || 'N/A',
          sub.isActive ? 'Active' : 'Inactive',
          new Date(sub.createdAt).toLocaleDateString(),
          new Date(sub.updatedAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscriptions-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Newsletter Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage and monitor newsletter subscribers
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Newsletter Subscriptions</h1>
            <p className="text-muted-foreground">
              Manage and monitor newsletter subscribers
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <p className="text-destructive">Failed to load subscriptions</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeSubscriptions =
    subscriptions?.filter((sub) => sub.isActive).length || 0;
  const totalSubscriptions = subscriptions?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage and monitor newsletter subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportSubscriptions}
            variant="outline"
            disabled={!subscriptions || subscriptions.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Total Subscribers</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{totalSubscriptions}</p>
          <p className="text-sm text-muted-foreground">
            All newsletter subscriptions
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-green-500"></div>
            <h3 className="font-semibold">Active Subscribers</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-600">
            {activeSubscriptions}
          </p>
          <p className="text-sm text-muted-foreground">
            Currently receiving emails
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-full bg-gray-400"></div>
            <h3 className="font-semibold">Inactive Subscribers</h3>
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-600">
            {totalSubscriptions - activeSubscriptions}
          </p>
          <p className="text-sm text-muted-foreground">
            Unsubscribed or inactive
          </p>
        </div>
      </div>

      <NewsletterTable
        subscriptions={subscriptions || []}
        onRefetch={refetch}
      />
    </div>
  );
}
