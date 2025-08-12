export interface SocialPost {
  id: string;
  platform: string;
  postUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  description?: string;
  publisher?: string;
  hashtags: string[];
}

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
