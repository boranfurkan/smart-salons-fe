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
import { Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminControllerDeleteSocialPost } from '@/lib/api/generated/admin/admin';
import { SocialPostResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import Image from 'next/image';

interface SocialPostDeleteDialogProps {
  socialPost: SocialPostResponseDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onRefetch: () => void;
}

export function SocialPostDeleteDialog({
  socialPost,
  open,
  onOpenChange,
  onClose,
  onRefetch,
}: SocialPostDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSocialPostMutation = useAdminControllerDeleteSocialPost({
    mutation: {
      onSuccess: () => {
        toast.success('Social post deleted successfully');
        onClose();
        onRefetch();
      },
      onError: (error: unknown) => {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || 'Failed to delete social post'
        );
        setIsDeleting(false);
      },
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSocialPostMutation.mutateAsync({
        id: socialPost.id,
      });
    } catch (error) {
      console.error('Error deleting social post:', error);
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
          <AlertDialogTitle>Delete Social Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this social post? This action cannot
            be undone.
            {socialPost.isActive && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800 font-medium">
                  ⚠️ This post is currently active and visible to users.
                </p>
              </div>
            )}
          </AlertDialogDescription>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              {socialPost.imageUrl ? (
                <div className="relative w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={String(socialPost.imageUrl)}
                    alt="Social post media"
                    fill
                    className="object-cover"
                    onError={() => {
                      console.error('Image failed to load');
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                  <div className="text-xs font-medium">
                    {socialPost.videoUrl ? 'VIDEO' : 'POST'}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {socialPost.platform.toLowerCase()}
                  </Badge>
                  <Badge
                    variant={socialPost.isActive ? 'default' : 'secondary'}
                    className={
                      socialPost.isActive ? 'bg-green-100 text-green-800' : ''
                    }
                  >
                    {socialPost.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {socialPost.description && (
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {String(socialPost.description)}
                  </p>
                )}
                {socialPost.publisher && (
                  <p className="text-sm font-medium mb-1">
                    {String(socialPost.publisher)}
                  </p>
                )}
                <a
                  href={socialPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  View original post
                </a>
              </div>
            </div>

            {socialPost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {socialPost.hashtags.slice(0, 5).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {socialPost.hashtags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{socialPost.hashtags.length - 5} more
                  </Badge>
                )}
              </div>
            )}
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
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
