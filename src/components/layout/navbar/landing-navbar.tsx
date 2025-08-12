'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';
import { DesktopNavbar } from './desktop-navbar';
import { MobileNavbar } from './mobile-navbar';

export function LandingNavbar() {
  const { data: categories, isLoading: categoriesLoading } =
    usePublicControllerGetCategories();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const userInitial = useMemo(() => {
    if (!user) return '';
    const name = user.firstName || user.email || 'U';
    return name.trim().charAt(0).toUpperCase();
  }, [user]);

  const sharedProps = {
    user,
    isAuthenticated,
    userInitial,
    categories: categories || [],
    categoriesLoading,
  };

  return (
    <>
      <DesktopNavbar
        {...sharedProps}
        catOpen={catOpen}
        setCatOpen={setCatOpen}
      />
      <MobileNavbar
        {...sharedProps}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </>
  );
}
