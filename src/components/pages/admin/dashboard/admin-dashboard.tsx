'use client';

import { AdminStats } from './admin-stats';
import { AdminRecentActivity } from './admin-recent-activity';
import { AdminQuickActions } from './admin-quick-actions';
import { AdminCharts } from './admin-charts';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Welcome to the Smart Salons admin panel. Manage your e-commerce
          platform from here.
        </p>
      </div>

      {/* Stats Cards */}
      <AdminStats />

      {/* Charts and Analytics */}
      <AdminCharts />

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <AdminQuickActions />
        <AdminRecentActivity />
      </div>
    </div>
  );
}
