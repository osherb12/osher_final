import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/api';

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      api.get('/users/wishlist')
      .then((data: any) => {
        if (data.success) setWishlistIds(data.data);
      });
    } else {
      setWishlistIds([]);
    }
  }, [token]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      alert('Authentication required: Sign in to save items to your wishlist.');
      return;
    }
    
    if (token) {
      await api.post('/users/wishlist', { productId });
    }
    setWishlistIds(prev => [...new Set([...prev, productId])]);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    if (token) {
      await api.delete(`/users/wishlist/${productId}`);
    }
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
