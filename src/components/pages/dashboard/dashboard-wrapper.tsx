'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSkeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { User, Settings, Package, Activity, LogOut } from 'lucide-react';

export function DashboardWrapper() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-11 w-24 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      <div className="relative p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.firstName}!
                </h1>
              </div>
              <p className="text-gray-600">
                Manage your Smart Salons experience from your dashboard
              </p>
            </div>
            <Button onClick={logout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-500">
                    Name
                  </span>
                  <span className="text-sm text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <span className="text-sm text-gray-900 truncate max-w-[200px]">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-500">
                    Role
                  </span>
                  <span className="text-sm text-gray-900 capitalize">
                    {user?.role}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => router.push('/products')}
                >
                  <Package className="w-4 h-4" />
                  Browse Products
                </Button>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => router.push('/orders')}
                >
                  <Activity className="w-4 h-4" />
                  View Orders
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button
                    className="w-full justify-start gap-2"
                    variant="outline"
                    onClick={() => router.push('/admin')}
                  >
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    No recent activity
                  </p>
                  <p className="text-xs text-gray-400">
                    Your activities will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional sections can be added here */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0">
              <CardHeader>
                <CardTitle className="text-white">
                  Welcome to Smart Salons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Discover our premium collection of salon furniture and
                  equipment. Start browsing to find the perfect pieces for your
                  salon.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/products')}
                  className="bg-white text-gray-900 hover:bg-gray-100"
                >
                  Explore Products
                </Button>
              </CardContent>
            </Card>

            {/* Stats or updates can go here */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600">
                      Account created
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600">
                      Email verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-400">
                      Browse products
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    <span className="text-sm text-gray-400">
                      Make first purchase
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
