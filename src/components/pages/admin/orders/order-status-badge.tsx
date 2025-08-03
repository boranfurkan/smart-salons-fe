import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const getStatusBadgeVariant = (): 'outline' => {
  // Use outline variant for all status badges for consistent styling
  return 'outline';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100';
    case 'CONFIRMED':
      return 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100';
    case 'PROCESSING':
      return 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100';
    case 'SHIPPED':
      return 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100';
    case 'DELIVERED':
      return 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100';
  }
};

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant={getStatusBadgeVariant()}
      className={`${getStatusColor(status)} ${className || ''}`}
    >
      {status}
    </Badge>
  );
}
