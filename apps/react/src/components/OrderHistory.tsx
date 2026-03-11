import React, { useEffect, useState } from 'react';
import { Order } from '@osher/shared';
import { OrderApi } from '../api/api';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, Eye, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderDetails } from './OrderDetails';

export const OrderHistory: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    OrderApi.getByUserId().then(res => {
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to cancel this order? It will be restocked.')) return;
    
    try {
      const data: any = await api.put(`/orders/${id}/cancel`);
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.error || 'Network error during cancellation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock size={16} className="text-primary" />;
      case 'shipped': return <Truck size={16} className="text-accent" />;
      case 'delivered': return <CheckCircle2 size={16} className="text-green-400" />;
      case 'cancelled': return <AlertCircle size={16} className="text-secondary" />;
      default: return <Package size={16} className="text-dracula-comment" />;
    }
  };

  if (loading) return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 w-full bg-dracula-bg/40 animate-pulse rounded-2xl border border-white/5" />
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="py-12 text-center flex flex-col items-center gap-4 bg-dracula-bg/20 rounded-3xl border border-dashed border-white/10">
      <Package size={48} className="text-dracula-comment opacity-20" />
      <p className="text-dracula-comment font-medium italic">You haven't placed any orders yet.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order, idx) => (
        <motion.div 
          key={(order as any)._id || order.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="group bg-dracula-bg/50 border border-white/5 hover:border-primary/30 rounded-2xl p-6 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5"
          onClick={() => setSelectedOrder(order)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-dracula-current p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                <Package size={24} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-black text-white uppercase tracking-wider">
                    Order #{((order as any)._id || order.id || '').slice(-8).toUpperCase()}
                  </span>
                  <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-dracula-current border border-white/5`}>
                    {getStatusIcon(order.status)}
                    <span className="text-white/80">{order.status}</span>
                  </div>
                </div>
                <p className="text-xs text-dracula-comment font-medium">
                  {new Date(order.createdAt!).toLocaleDateString('en-US', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
              <div className="text-right mr-4">
                <p className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mb-0.5">Total Amount</p>
                <p className="text-lg font-black text-white">${order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                {(order.status === 'processing' || order.status === 'pending') && (
                  <button 
                    onClick={(e) => handleCancelOrder(e, (order as any)._id || order.id!)}
                    className="bg-secondary/10 p-2 rounded-lg text-secondary hover:bg-secondary hover:text-dracula-bg transition-all"
                    title="Cancel Order"
                  >
                    <XCircle size={18} />
                  </button>
                )}
                <div className="bg-primary/5 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-dracula-bg transition-all">
                  <Eye size={18} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
