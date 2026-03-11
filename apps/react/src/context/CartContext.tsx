import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, Product, ApiResponse } from '@osher/shared';
import { useAuth } from './AuthContext';
import api from '../api/api';

interface CartContextType {
  items: (CartItem & { product: Product })[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'oshopper_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<(CartItem & { product: Product })[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const { user, token } = useAuth();
  // Track the previous token to detect login transitions
  const prevTokenRef = useRef<string | null>(null);

  // Persist to localStorage for guests
  useEffect(() => {
    if (!token) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, token]);

  // Sync cart when user logs in: merge guest cart into backend cart, then load result
  useEffect(() => {
    const previousToken = prevTokenRef.current;
    prevTokenRef.current = token;

    if (!token) return;
    // Only run when transitioning from logged-out → logged-in
    if (previousToken === token) return;

    const guestItems = previousToken === null ? items : [];

    const syncCart = async () => {
      try {
        // Push guest items to backend first (merging)
        for (const guestItem of guestItems) {
          try {
            await api.post('/users/cart', { productId: guestItem.productId, quantity: guestItem.quantity });
          } catch {
            // best-effort: skip items that fail (e.g. out of stock)
          }
        }

        // Load the now-merged cart from backend
        const data: any = await api.get('/users/cart');
        if (data.success) {
          const backendItems: CartItem[] = data.data;
          const populated = await Promise.all(
            backendItems.map(async item => {
              try {
                const pData: any = await api.get(`/products/${item.productId}`);
                return { ...item, product: pData.data };
              } catch {
                return null;
              }
            })
          );
          setItems(populated.filter(Boolean) as (CartItem & { product: Product })[]);
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch {
        // If cart sync fails, keep the current in-memory state
      }
    };

    syncCart();
  }, [token]);

  const addToCart = async (product: Product) => {
    const id = (product as any)._id || product.id;
    if (!id) return;

    const existingItem = items.find(item => item.productId === id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + 1 > product.stock) {
      alert(`Limit reached: Only ${product.stock} units available in stock.`);
      return;
    }

    if (token) {
      try {
        await api.post('/users/cart', { productId: id, quantity: 1 });
      } catch (err: any) {
        alert(err?.error || 'Failed to add item to cart');
        return;
      }
    }

    setItems(prev => {
      const existing = prev.find(item => item.productId === id);
      if (existing) {
        return prev.map(item =>
          item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: id, quantity: 1, product }];
    });
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + delta;

    if (newQuantity < 0) return;

    if (delta > 0 && newQuantity > item.product.stock) {
      alert(`Limit reached: Only ${item.product.stock} units available in stock.`);
      return;
    }

    if (token) {
      try {
        await api.post('/users/cart', { productId, quantity: delta });
      } catch (err: any) {
        alert(err?.error || 'Failed to update cart');
        return;
      }
    }

    if (newQuantity === 0) {
      setItems(prev => prev.filter(i => i.productId !== productId));
    } else {
      setItems(prev =>
        prev.map(i => i.productId === productId ? { ...i, quantity: newQuantity } : i)
      );
    }
  };

  const removeFromCart = async (productId: string) => {
    if (token) {
      try {
        await api.delete(`/users/cart/${productId}`);
      } catch (err: any) {
        alert(err?.error || 'Failed to remove item from cart');
        return;
      }
    }
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = async () => {
    if (token) {
      try {
        await api.delete('/users/cart');
      } catch {
        // best-effort clear
      }
    }
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
