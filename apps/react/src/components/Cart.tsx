import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCartDrawer } from '../context/CartDrawerContext';
import { OrderApi } from '../api/api';
import { Order } from '@osher/shared';
import { ShoppingCart, Trash2, CreditCard, X, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { closeDrawer } = useCartDrawer();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    closeDrawer();
    navigate('/checkout');
  };

  if (ordered) {
    return (
      <div className="bg-dracula-current rounded-2xl p-10 border border-accent/20 flex flex-col items-center text-center gap-6 shadow-2xl">
        <div className="bg-accent/10 p-5 rounded-full">
          <CheckCircle2 size={56} className="text-accent" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Order Successful</h3>
          <p className="text-dracula-comment leading-relaxed">Thank you for shopping with Oshopper. Your order is being processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dracula-bg flex flex-col h-full">
      <div className="px-6 py-6 border-b border-dracula-current flex items-center justify-between bg-dracula-bg/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-white">Your Cart</h2>
        </div>
        <span className="bg-dracula-current text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">{items.length} Items</span>
      </div>

      <div className="flex-grow p-6 overflow-y-auto no-scrollbar">
        {items.length === 0 ? (
          <div className="py-20 text-center text-dracula-comment flex flex-col items-center gap-6 opacity-40">
            <ShoppingCart size={64} strokeWidth={1.5} />
            <p className="text-lg font-medium">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <div 
                key={item.productId}
                className="flex justify-between items-center bg-dracula-current/40 p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all group shadow-sm"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {item.product.name}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <button 
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-6 h-6 rounded-md bg-dracula-bg border border-white/5 flex items-center justify-center text-dracula-comment hover:text-white hover:border-primary/50 transition-all"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.productId, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="w-6 h-6 rounded-md bg-dracula-bg border border-white/5 flex items-center justify-center text-dracula-comment hover:text-white hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title={item.quantity >= item.product.stock ? "Maximum stock reached" : ""}
                    >
                      +
                    </button>
                  </div>
                  {item.product.stock < 5 && (
                    <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter mt-1 animate-pulse">
                      Only {item.product.stock} left
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-secondary">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 hover:bg-secondary/10 rounded-lg transition-colors text-dracula-comment hover:text-secondary"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t border-dracula-current bg-dracula-bg/80 backdrop-blur-md sticky bottom-0">
          <div className="flex justify-between items-center mb-6">
            <span className="text-dracula-comment font-bold uppercase tracking-[0.2em] text-xs">Total Amount</span>
            <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-dracula-bg border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span className="uppercase tracking-widest text-sm">Checkout Now</span>
                </>
              )}
            </button>
            <button 
              onClick={clearCart}
              className="w-full py-3 text-dracula-comment hover:text-secondary transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Trash2 size={14} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
