export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface JoinButtonProps {
  href: string;
  children: React.ReactNode;
}

export interface CartButtonProps {
  count?: number;
}
