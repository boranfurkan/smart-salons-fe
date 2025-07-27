import { DashboardWrapper } from '@/components/pages/dashboard/dashboard-wrapper';
import { PageGuard } from '@/components/shared/auth/page-guard';

export default function DashboardPage() {
  return (
    <PageGuard requireAuth={true}>
      <DashboardWrapper />
    </PageGuard>
  );
}
