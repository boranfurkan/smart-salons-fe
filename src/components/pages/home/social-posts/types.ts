import type { SocialPostResponseDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

export type SocialPost = SocialPostResponseDto;

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
