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
import { Loader2, User, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteUser } from '@/lib/api/generated/admin/admin';
import { UserResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface UserDeleteDialogProps {
  user: UserResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function UserDeleteDialog({
  user,
  open,
  onOpenChange,
  onClose,
}: UserDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUserMutation = useAdminControllerDeleteUser({
    mutation: {
      onSuccess: () => {
        toast.success('User deleted successfully');
        onClose();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to delete user'
        );
        setIsDeleting(false);
      },
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteUserMutation.mutateAsync({
        id: user.id,
      });
    } catch (error) {
      // Error handling is done in the mutation callback
      console.error('Error deleting user:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setIsDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
              {user.role === 'ADMIN' ? (
                <Shield className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>

              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  >
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <Badge
                    variant={user.isEmailVerified ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>

              {user.role === 'ADMIN' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-medium">
                    ⚠️ Warning: You are about to delete an admin user.
                  </p>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
