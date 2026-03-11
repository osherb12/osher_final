import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Order } from '@osher/shared';
import { CheckCircle2, ShoppingBag, Truck, MapPin, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-[800px] mx-auto p-4 md:p-12">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dracula-current/40 border border-white/5 p-12 rounded-3xl text-center shadow-2xl overflow-hidden relative"
      >
        <div className="bg-accent/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={56} className="text-accent" />
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Order Successful!</h1>
        <p className="text-dracula-comment mb-10 leading-relaxed font-medium">
          Thank you for choosing Oshopper. Your order <strong>#{((order as any)._id || order.id || '').slice(-8).toUpperCase()}</strong> has been placed and is being processed.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left border-y border-white/5 py-10 mb-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <MapPin size={16} />
              <span>Shipping To</span>
            </div>
            <div className="bg-dracula-bg/50 p-6 rounded-2xl border border-white/5">
              <p className="text-white font-bold mb-1">{order.address?.street}</p>
              <p className="text-dracula-comment text-sm font-medium">{order.address?.city}, {order.address?.zip}</p>
              <p className="text-dracula-comment text-sm font-medium uppercase tracking-widest mt-2">{order.address?.country}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
              <Package size={16} />
              <span>Order Summary</span>
            </div>
            <div className="bg-dracula-bg/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <p className="text-dracula-comment text-sm font-medium mb-4">
                Total Items: {order.items.reduce((sum, i) => sum + i.quantity, 0)}
              </p>
              <div className="flex justify-between items-baseline">
                <span className="text-dracula-comment font-bold uppercase tracking-widest text-[10px]">Total Paid</span>
                <span className="text-2xl font-black text-white">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/products" 
            className="bg-primary text-dracula-bg font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          <Link 
            to="/profile" 
            className="bg-dracula-current text-white font-bold py-5 px-10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
          >
            View Orders
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
