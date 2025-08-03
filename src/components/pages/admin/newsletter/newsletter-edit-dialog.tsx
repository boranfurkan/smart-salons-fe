'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Loader2, Mail, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerUpdateNewsletterSubscription } from '@/lib/api/generated/admin/admin';
import { NewsletterSubscriptionResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface NewsletterEditDialogProps {
  subscription: NewsletterSubscriptionResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onRefetch: () => void;
}

const updateSubscriptionSchema = z.object({
  isActive: z.boolean(),
});

type UpdateSubscriptionFormData = z.infer<typeof updateSubscriptionSchema>;

export function NewsletterEditDialog({
  subscription,
  open,
  onOpenChange,
  onClose,
  onRefetch,
}: NewsletterEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateSubscriptionFormData>({
    resolver: zodResolver(updateSubscriptionSchema),
    defaultValues: {
      isActive: subscription.isActive,
    },
  });

  const updateSubscriptionMutation =
    useAdminControllerUpdateNewsletterSubscription({
      mutation: {
        onSuccess: () => {
          toast.success('Newsletter subscription updated successfully');
          handleClose();
          onRefetch();
        },
        onError: (error: unknown) => {
          toast.error(
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || 'Failed to update newsletter subscription'
          );
          setIsSubmitting(false);
        },
      },
    });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
    onClose();
    setIsSubmitting(false);
  };

  const onSubmit = async (data: UpdateSubscriptionFormData) => {
    setIsSubmitting(true);

    try {
      await updateSubscriptionMutation.mutateAsync({
        id: subscription.id,
        data: {
          isActive: data.isActive,
        },
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Newsletter Subscription</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-4">
              {/* Subscription Info */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{subscription.email}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {subscription.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {subscription.userId ? (
                      <>
                        <User className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Registered User
                        </span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-500 font-medium">
                          Guest Subscriber
                        </span>
                      </>
                    )}
                  </div>
                  {subscription.userId && (
                    <div>
                      <p className="text-muted-foreground">User ID</p>
                      <p className="font-mono text-xs">
                        {String(subscription.userId)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Subscribed</p>
                      <p>
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p>
                      {new Date(subscription.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Control */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Subscription Status
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {field.value
                          ? 'This subscriber will receive newsletter emails'
                          : 'This subscriber will not receive newsletter emails'}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Updating...' : 'Update Subscription'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
