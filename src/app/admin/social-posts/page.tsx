'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAdminControllerGetAllSocialPosts } from '@/lib/api/generated/admin/admin';
import { SocialPostsTable } from '@/components/pages/admin/social-posts/social-posts-table';
import { SocialPostCreateDialog } from '@/components/pages/admin/social-posts/social-post-create-dialog';

export default function SocialPostsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    data: socialPosts,
    isLoading,
    error,
    refetch,
  } = useAdminControllerGetAllSocialPosts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Social Posts</h1>
            <p className="text-muted-foreground">
              Manage your social media posts and content
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading social posts...</p>
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
            <h1 className="text-3xl font-bold">Social Posts</h1>
            <p className="text-muted-foreground">
              Manage your social media posts and content
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-2">
            <p className="text-destructive">Failed to load social posts</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Social Posts</h1>
          <p className="text-muted-foreground">
            Manage your social media posts and content
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Social Post
        </Button>
      </div>

      <SocialPostsTable socialPosts={socialPosts || []} onRefetch={refetch} />

      <SocialPostCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onRefetch={refetch}
      />
    </div>
  );
}
