'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Instagram,
  Facebook,
  Twitter,
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
import { SocialPostResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { SocialPostEditDialog } from './social-post-edit-dialog';
import { SocialPostDeleteDialog } from './social-post-delete-dialog';
import Image from 'next/image';

interface SocialPostsTableProps {
  socialPosts: SocialPostResponseDto[];
  onRefetch: () => void;
}

const PLATFORMS = ['INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'TWITTER'] as const;

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'INSTAGRAM':
      return <Instagram className="h-4 w-4" />;
    case 'FACEBOOK':
      return <Facebook className="h-4 w-4" />;
    case 'TWITTER':
      return <Twitter className="h-4 w-4" />;
    default:
      return <div className="h-4 w-4 rounded bg-muted" />;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'INSTAGRAM':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    case 'FACEBOOK':
      return 'bg-blue-600';
    case 'TWITTER':
      return 'bg-sky-500';
    case 'TIKTOK':
      return 'bg-black';
    default:
      return 'bg-gray-500';
  }
};

export function SocialPostsTable({
  socialPosts,
  onRefetch,
}: SocialPostsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingSocialPost, setEditingSocialPost] =
    useState<SocialPostResponseDto | null>(null);
  const [deletingSocialPost, setDeletingSocialPost] =
    useState<SocialPostResponseDto | null>(null);

  // Filter social posts based on search and filters
  const filteredSocialPosts = socialPosts.filter((socialPost) => {
    const matchesSearch =
      (socialPost.description &&
        String(socialPost.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (socialPost.publisher &&
        String(socialPost.publisher)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      socialPost.hashtags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesPlatform =
      !selectedPlatform ||
      selectedPlatform === 'all' ||
      socialPost.platform === selectedPlatform;
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && socialPost.isActive) ||
      (selectedStatus === 'inactive' && !socialPost.isActive);

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by description, publisher, or hashtags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {PLATFORMS.map((platform) => (
              <SelectItem key={platform} value={platform}>
                <div className="flex items-center gap-2">
                  {getPlatformIcon(platform)}
                  {platform.toLowerCase()}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSocialPosts.length} of {socialPosts.length} social
        posts
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Media</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Hashtags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSocialPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ||
                    (selectedPlatform && selectedPlatform !== 'all') ||
                    (selectedStatus && selectedStatus !== 'all')
                      ? 'No social posts match your filters'
                      : 'No social posts found'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSocialPosts.map((socialPost) => (
                <TableRow key={socialPost.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {socialPost.imageUrl ? (
                        <div className="relative w-12 h-12 bg-muted rounded overflow-hidden">
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
                      ) : socialPost.videoUrl ? (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <div className="text-xs font-medium">VIDEO</div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <div className="text-xs font-medium">POST</div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-1 rounded ${getPlatformColor(
                          socialPost.platform
                        )} text-white`}
                      >
                        {getPlatformIcon(socialPost.platform)}
                      </div>
                      <span className="font-medium">
                        {socialPost.platform.toLowerCase()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      {socialPost.description ? (
                        <p
                          className="text-sm truncate"
                          title={String(socialPost.description)}
                        >
                          {String(socialPost.description)}
                        </p>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No description
                        </span>
                      )}
                      <a
                        href={socialPost.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View post
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {socialPost.publisher ? (
                      <span className="text-sm font-medium">
                        {String(socialPost.publisher)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {socialPost.hashtags.length > 0 ? (
                        socialPost.hashtags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No hashtags
                        </span>
                      )}
                      {socialPost.hashtags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{socialPost.hashtags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={socialPost.isActive ? 'default' : 'secondary'}
                      className={
                        socialPost.isActive
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-600'
                      }
                    >
                      {socialPost.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(socialPost.createdAt).toLocaleDateString()}
                    </div>
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
                          onClick={() => setEditingSocialPost(socialPost)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingSocialPost(socialPost)}
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
      {editingSocialPost && (
        <SocialPostEditDialog
          socialPost={editingSocialPost}
          open={!!editingSocialPost}
          onOpenChange={(open: boolean) => !open && setEditingSocialPost(null)}
          onClose={() => setEditingSocialPost(null)}
          onRefetch={onRefetch}
        />
      )}

      {/* Delete Dialog */}
      {deletingSocialPost && (
        <SocialPostDeleteDialog
          socialPost={deletingSocialPost}
          open={!!deletingSocialPost}
          onOpenChange={(open: boolean) => !open && setDeletingSocialPost(null)}
          onClose={() => setDeletingSocialPost(null)}
          onRefetch={onRefetch}
        />
      )}
    </div>
  );
}
