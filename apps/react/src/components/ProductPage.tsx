import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Product } from '@osher/shared';
import { ProductApi } from '../api/api';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { ProductDetailSkeleton } from './SkeletonLoader';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = () => {
    if (id) {
      ProductApi.getById(id).then(res => {
        if (res.success && res.data) {
          setProduct(res.data);
          setLoading(false);
        } else {
          navigate('/404', { replace: true });
        }
      }).catch(() => navigate('/404', { replace: true }));
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, navigate]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmittingReview(true);
    try {
      const data: any = await api.post(`/products/${id}/reviews`, { 
        productId: id, 
        rating: reviewRating, 
        comment: reviewComment 
      });
      if (data.success) {
        setReviewComment('');
        setReviewRating(5);
        fetchProduct();
      }
    } catch (err: any) {
      alert(err.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8">
      <ProductDetailSkeleton />
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2">
        <ArrowLeft size={18} /> Back to Store
      </Link>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1200px] mx-auto p-4 md:p-8"
    >
      <Link to="/products" className="inline-flex items-center gap-2 text-dracula-comment hover:text-primary mb-10 transition-colors group font-bold uppercase tracking-widest text-xs">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Return to Catalog</span>
      </Link>

      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="rounded-3xl overflow-hidden bg-dracula-current border border-white/5 shadow-2xl aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-primary uppercase tracking-[0.3em]">{product.category}</span>
            <h1 className="text-5xl font-bold text-white tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-6 text-sm text-dracula-comment font-bold">
              {product.reviewCount && product.reviewCount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-white">{product.averageRating?.toFixed(1)}</span>
                  <span className="opacity-50 ml-1">({product.reviewCount} Reviews)</span>
                </div>
              ) : (
                <span className="text-dracula-comment italic">No reviews yet</span>
              )}
              <span className="w-1 h-1 bg-dracula-comment rounded-full"></span>
              <span className={product.stock > 0 ? 'text-accent' : 'text-secondary'}>
                {product.stock > 0 ? `In Stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p className="text-dracula-fg/70 leading-relaxed text-xl font-medium">
            {product.description}
          </p>

          <div className="flex items-baseline gap-6">
            <span className="text-5xl font-bold text-white">${product.price.toFixed(2)}</span>
            {product.price > 100 && (
              <span className="text-dracula-comment line-through text-2xl decoration-secondary opacity-50">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>

          <button 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-2xl shadow-primary/20 text-lg uppercase tracking-widest active:scale-[0.98]"
          >
            <ShoppingCart size={22} />
            <span>Add to Cart</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-10 border-t border-dracula-current">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-dracula-current rounded-xl text-accent"><Truck size={24} /></div>
              <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-dracula-current rounded-xl text-accent"><Shield size={24} /></div>
              <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">Secure Order</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-dracula-current rounded-xl text-accent"><RotateCcw size={24} /></div>
              <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-32 pt-20 border-t border-dracula-current">
        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className={i < Math.round(product.averageRating || 0) ? "text-yellow-400 fill-yellow-400" : "text-dracula-comment opacity-30"} />
                ))}
              </div>
              <span className="text-white font-bold">{product.averageRating?.toFixed(1)} average based on {product.reviewCount} ratings</span>
            </div>
          </div>
        </div>

        {user && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
              <Star className="text-primary fill-primary" size={24} />
              Share Your Thoughts
            </h3>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star 
                        size={32} 
                        className={star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-dracula-comment opacity-20"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Write a Comment</label>
                <textarea 
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Tell us what you love or how we can improve..."
                  className="w-full bg-dracula-bg border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all min-h-[120px] resize-none"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={submittingReview}
                className="self-start px-12 py-4 bg-primary text-dracula-bg font-black rounded-2xl transition-all hover:bg-primary/90 uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </motion.div>
        )}

        {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.reviews.map((review, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dracula-bg/40 border border-white/5 p-8 rounded-[32px] flex flex-col gap-4 group hover:border-primary/20 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-bold tracking-tight text-lg">{review.userName}</span>
                    <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">
                      {new Date(review.createdAt!).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-1 bg-dracula-bg px-3 py-1.5 rounded-full border border-white/5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-dracula-comment opacity-20"} />
                    ))}
                  </div>
                </div>
                <p className="text-dracula-fg/80 leading-relaxed font-medium">
                  "{review.comment}"
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-dracula-bg/20 rounded-3xl border border-dashed border-white/10">
            <p className="text-dracula-comment font-bold uppercase tracking-widest text-xs">No reviews yet for this product. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
