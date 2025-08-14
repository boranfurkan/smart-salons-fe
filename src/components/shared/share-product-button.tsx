'use client';

import { useState } from 'react';
import { Share2, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ShareProductButtonProps {
  productName?: string;
  className?: string;
}

export function ShareProductButton({
  productName = 'this product',
  className,
}: ShareProductButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    setIsSharing(true);

    try {
      // Get current page URL
      const currentUrl = window.location.href;

      // Copy to clipboard
      await navigator.clipboard.writeText(currentUrl);

      setCopied(true);
      toast.success(`Link to ${productName} copied to clipboard!`);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setIsPopoverOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleButtonClick = () => {
    // Always use our custom popover instead of native sharing
    setIsPopoverOpen(true);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleButtonClick}
          disabled={isSharing}
          variant="outline"
          size="icon"
          className={cn(
            'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50',
            className
          )}
        >
          {isSharing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="center" side="top">
        <div className="space-y-3">
          <p className="text-sm text-center font-medium">Share {productName}</p>
          <div className="space-y-2">
            <Button
              size="sm"
              onClick={handleCopyLink}
              disabled={isSharing}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPopoverOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
