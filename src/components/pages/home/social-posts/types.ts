import type { SocialPostDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export type SocialPost = SocialPostDto;

export interface SocialPostCardProps {
  post: SocialPost;
  width: number;
  height: number;
  margin: number;
}

export interface Platform {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  url: string;
}
