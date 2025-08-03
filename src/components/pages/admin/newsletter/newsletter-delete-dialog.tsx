'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteNewsletterSubscription } from '@/lib/api/generated/admin/admin';
import { NewsletterSubscriptionResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface NewsletterDeleteDialogProps {
  subscription: NewsletterSubscriptionResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onRefetch: () => void;
}

export function NewsletterDeleteDialog({
  subscription,
  open,
  onOpenChange,
  onClose,
  onRefetch,
}: NewsletterDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSubscriptionMutation =
    useAdminControllerDeleteNewsletterSubscription({
      mutation: {
        onSuccess: () => {
          toast.success('Newsletter subscription deleted successfully');
          onClose();
          onRefetch();
        },
        onError: (error: unknown) => {
          toast.error(
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to delete newsletter subscription'
          );
          setIsDeleting(false);
        },
      },
    });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSubscriptionMutation.mutateAsync({
        id: subscription.id,
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onOpenChange(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Newsletter Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this newsletter subscription? This
            action cannot be undone.
            {subscription.isActive && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ This is an active subscription. The subscriber will no
                  longer receive newsletters.
                </p>
              </div>
            )}
          </AlertDialogDescription>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={subscription.isActive ? 'default' : 'secondary'}
                    className={
                      subscription.isActive ? 'bg-green-100 text-green-800' : ''
                    }
                  >
                    {subscription.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {subscription.userId ? (
                    <Badge variant="outline" className="text-xs">
                      <User className="h-3 w-3 mr-1" />
                      Registered
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      Guest
                    </Badge>
                  )}
                </div>
                <p className="font-medium truncate">{subscription.email}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  ID: {subscription.id}
                </p>
                {subscription.userId && (
                  <p className="text-xs text-muted-foreground mb-2">
                    User ID: {String(subscription.userId)}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Subscribed{' '}
                    {new Date(subscription.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Deleting...' : 'Delete Subscription'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
