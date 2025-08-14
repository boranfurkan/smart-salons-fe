'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Package,
  Calendar,
  CreditCard,
  Download,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function CheckoutSuccessView() {
  const searchParams = useSearchParams();
  const [orderNumber] = useState(
    () =>
      searchParams.get('orderNumber') || `SS${Date.now().toString().slice(-6)}`
  );
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5); // 5 days from now
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  useEffect(() => {
    // Clear cart after successful order
    // TODO: Implement cart clearing logic
    console.log('Order placed successfully, clearing cart...');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been successfully
              placed.
            </p>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-8 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Order Number
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">{orderNumber}</span>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Method
                  </h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">**** **** **** 3456</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Estimated Delivery
                  </h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{estimatedDelivery}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Shipping Address
                  </h3>
                  <div className="text-gray-600 text-sm">
                    <p>John Doe</p>
                    <p>123 Main Street</p>
                    <p>New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal (3 items)</span>
                  <span>$349.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$28.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>$377.97</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-2xl p-6 mb-8"
          >
            <h3 className="font-semibold text-gray-900 mb-4">
              What happens next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Order Confirmation
                  </p>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email confirmation with your order details
                    within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-gray-600 text-sm">
                    We'll prepare your order for shipment within 1-2 business
                    days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Shipping</p>
                  <p className="text-gray-600 text-sm">
                    You'll receive tracking information once your order ships.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button className="flex-1" size="lg">
              <Package className="w-4 h-4 mr-2" />
              Track Your Order
            </Button>

            <Button variant="outline" className="flex-1" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>

            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-12 p-6 bg-gray-100 rounded-xl"
          >
            <Mail className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your order, our customer support
              team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/support">
                <Button variant="ghost" size="sm">
                  Contact Support
                </Button>
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <Link href="/faq">
                <Button variant="ghost" size="sm">
                  View FAQ
                </Button>
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <Link href="/returns">
                <Button variant="ghost" size="sm">
                  Return Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
