import React, { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '@osher/shared';
import { ProductApi } from '../api/api';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      const populated = await Promise.all(
        wishlistIds.map(async id => {
          const res = await ProductApi.getById(id);
          return res.success ? res.data : null;
        })
      );
      setProducts(populated.filter(p => p !== null) as Product[]);
      setLoading(false);
    };

    fetchWishlist();
  }, [wishlistIds]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-12 border-b border-dracula-current pb-6">
        <div className="flex items-center gap-4">
          <Heart className="text-secondary w-8 h-8 fill-secondary" />
          <h2 className="text-4xl font-bold tracking-tight">My Wishlist</h2>
        </div>
        <Link to="/products" className="flex items-center gap-2 text-dracula-comment hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-32 flex justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="py-32 text-center flex flex-col items-center gap-6">
          <div className="bg-dracula-current p-8 rounded-full">
            <Heart size={56} className="text-dracula-comment opacity-20" />
          </div>
          <div>
            <p className="text-white text-xl font-bold">Your wishlist is empty</p>
            <p className="text-dracula-comment mt-2">Save items you like to find them later.</p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 px-8 py-3 bg-primary text-dracula-bg rounded-xl font-bold hover:bg-primary/90 transition-all uppercase tracking-widest text-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {products.map(p => (
              <ProductCard key={(p as any)._id || p.id} product={p} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
