import React from 'react';
import { Order } from '@osher/shared';
import { motion } from 'framer-motion';
import { X, MapPin, Package, CreditCard, ShoppingBag, ShieldCheck, Clock, CheckCircle2, Truck, AlertCircle } from 'lucide-react';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock size={20} className="text-primary" />;
      case 'shipped': return <Truck size={20} className="text-accent" />;
      case 'delivered': return <CheckCircle2 size={20} className="text-green-400" />;
      case 'cancelled': return <AlertCircle size={20} className="text-secondary" />;
      default: return <Package size={20} className="text-dracula-comment" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dracula-bg/90 backdrop-blur-lg"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-[800px] bg-dracula-current border border-white/5 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-dracula-current z-10">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-3xl font-black text-white tracking-tight">Order Details</h3>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-dracula-bg/50 border border-white/5`}>
                {getStatusIcon(order.status)}
                <span className="text-white/80">{order.status}</span>
              </div>
            </div>
            <p className="text-xs text-dracula-comment font-bold uppercase tracking-widest">
              Reference #{((order as any)._id || order.id || '').slice(-12).toUpperCase()} — {new Date(order.createdAt!).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-4 hover:bg-dracula-bg/50 rounded-full transition-all text-dracula-comment hover:text-white group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto no-scrollbar px-10 py-10">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Shipping Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                <MapPin size={16} />
                <span>Shipping Destination</span>
              </div>
              <div className="bg-dracula-bg/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                <p className="text-white font-bold text-lg mb-2">{order.address?.street}</p>
                <p className="text-dracula-comment font-medium text-sm leading-relaxed">
                  {order.address?.city}, {order.address?.zip}<br />
                  {order.address?.country}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
                <CreditCard size={16} />
                <span>Payment Summary</span>
              </div>
              <div className="bg-dracula-bg/40 p-8 rounded-3xl border border-white/5 shadow-inner space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-dracula-comment font-medium">Subtotal</span>
                  <span className="text-white font-bold">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-dracula-comment font-medium">Standard Shipping</span>
                  <span className="text-accent font-bold uppercase tracking-widest text-[10px]">Free</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white font-bold uppercase tracking-widest text-xs">Total Paid</span>
                  <span className="text-2xl font-black text-white">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px]">
              <ShoppingBag size={16} />
              <span>Purchased Items ({order.items.length})</span>
            </div>
            
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-dracula-bg/30 p-6 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="bg-dracula-current p-4 rounded-xl text-primary border border-white/5 group-hover:scale-105 transition-transform">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-xs text-dracula-comment font-medium">
                        Unit Price: ${item.price.toFixed(2)} × {item.quantity} units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 border-t border-white/5 bg-dracula-bg/20 flex items-center justify-between sticky bottom-0 z-10">
          <div className="flex items-center gap-3 text-dracula-comment">
            <ShieldCheck size={20} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Certified Transaction Security</span>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
};
