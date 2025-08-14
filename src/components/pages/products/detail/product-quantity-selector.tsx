'use client';

import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export function ProductQuantitySelector({
  quantity,
  maxQuantity,
  onQuantityChange,
  disabled = false,
}: ProductQuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1 && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity && !disabled) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Quantity</h3>
        {maxQuantity > 0 && (
          <span className="text-sm text-gray-600">
            {maxQuantity > 10 ? '10+' : maxQuantity} available
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || quantity <= 1}
          className={cn(
            'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200',
            disabled || quantity <= 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 active:scale-95'
          )}
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1 max-w-20">
          <input
            type="number"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={handleInputChange}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600',
              disabled
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-900'
            )}
          />
        </div>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || quantity >= maxQuantity}
          className={cn(
            'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200',
            disabled || quantity >= maxQuantity
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 active:scale-95'
          )}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {maxQuantity === 0 && (
        <p className="text-sm text-red-600">Out of stock</p>
      )}

      {maxQuantity > 0 && quantity === maxQuantity && maxQuantity <= 10 && (
        <p className="text-sm text-orange-600">Maximum quantity reached</p>
      )}
    </div>
  );
}
