import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { AddressSchema, Order, Address } from '@osher/shared';
import { OrderApi } from '../api/api';
import { CreditCard, Truck, MapPin, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    zip: '',
    country: ''
  });

  const [paymentStep, setPaymentStep] = useState(false);

  if (items.length === 0) {
    navigate('/products');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = AddressSchema.safeParse(address);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);
    setPaymentStep(true);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    const order: Order = {
      items: items.map(i => ({
        productId: i.productId,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
      })),
      totalPrice,
      address,
      status: 'processing'
    };

    try {
      const res = await OrderApi.create(order);
      if (res.success && res.data) {
        clearCart();
        navigate('/order-success', { state: { order: res.data } });
      } else {
        setError(res.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Network error during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-5 gap-12">
        {/* Main Content */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Checkout</h1>
          
          <div className="flex items-center gap-4 mb-10">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${!paymentStep ? 'bg-primary text-dracula-bg shadow-lg shadow-primary/20' : 'bg-accent/20 text-accent'}`}>1</div>
            <div className="h-px flex-grow bg-dracula-current"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${paymentStep ? 'bg-primary text-dracula-bg shadow-lg shadow-primary/20' : 'bg-dracula-current text-dracula-comment'}`}>2</div>
          </div>

          {!paymentStep ? (
            <motion.form 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleAddressSubmit} 
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-2">
                <Truck size={16} />
                <span>Shipping Address</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest">Street Address</label>
                  <input 
                    type="text"
                    required
                    value={address.street}
                    onChange={e => setAddress({...address, street: e.target.value})}
                    placeholder="123 Cyberpunk Blvd"
                    className="bg-dracula-current border border-white/5 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest">City</label>
                    <input 
                      type="text"
                      required
                      value={address.city}
                      onChange={e => setAddress({...address, city: e.target.value})}
                      placeholder="Neo-Tokyo"
                      className="bg-dracula-current border border-white/5 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest">Zip Code</label>
                    <input 
                      type="text"
                      required
                      value={address.zip}
                      onChange={e => setAddress({...address, zip: e.target.value})}
                      placeholder="10101"
                      className="bg-dracula-current border border-white/5 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest">Country</label>
                  <input 
                    type="text"
                    required
                    value={address.country}
                    onChange={e => setAddress({...address, country: e.target.value})}
                    placeholder="Unified World"
                    className="bg-dracula-current border border-white/5 rounded-xl px-5 py-4 text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-secondary/10 border border-secondary/20 p-4 rounded-xl text-secondary text-sm flex items-center gap-3">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-primary text-dracula-bg font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-primary/90 shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] mt-6"
              >
                Proceed to Payment
              </button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                  <CreditCard size={16} />
                  <span>Secure Payment</span>
                </div>
                <div className="bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Demo Mode</span>
                </div>
              </div>

              <div className="bg-dracula-current border border-white/5 p-8 rounded-3xl flex flex-col gap-6">
                <div className="flex items-center gap-4 text-dracula-comment">
                  <ShieldCheck className="text-accent" />
                  <p className="text-sm font-medium">Your connection is encrypted and payment is processed securely via OshoPay.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-1 rounded-md">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" alt="Visa" className="w-10" />
                      </div>
                      <span className="text-white font-bold">Ending in 4242</span>
                    </div>
                    <span className="text-xs font-bold text-dracula-comment">EXPIRES 12/28</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-dracula-comment bg-dracula-current/40 p-5 rounded-xl border border-white/5">
                <MapPin size={20} className="shrink-0" />
                <span>Shipping to: <strong>{address.street}, {address.city}</strong></span>
                <button onClick={() => setPaymentStep(false)} className="ml-auto text-primary hover:underline text-xs font-bold uppercase tracking-widest">Change</button>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-dracula-bg font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-primary/90 shadow-2xl shadow-primary/20 uppercase tracking-[0.2em]"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : `Pay $${totalPrice.toFixed(2)} Now`}
              </button>
            </motion.div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="md:col-span-2">
          <div className="bg-dracula-current border border-white/5 rounded-3xl p-8 sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-dracula-comment">{item.quantity}x {item.product.name}</span>
                  <span className="text-white font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-dracula-comment">Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dracula-comment">Shipping</span>
                <span className="text-accent font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-black text-white pt-4">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
