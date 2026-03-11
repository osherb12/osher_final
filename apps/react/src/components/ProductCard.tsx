import React from 'react';
import { Product } from '@osher/shared';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const id = (product as any)._id || product.id;
  
  const isWishlisted = isInWishlist(id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) removeFromWishlist(id);
    else addToWishlist(id);
  };
  
  return (
    <div className="group relative bg-dracula-current rounded-xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-square w-full overflow-hidden bg-dracula-bg">
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-secondary text-dracula-bg text-[10px] font-bold px-2.5 py-1 rounded-full z-20 shadow-lg">LIMITED</span>
        )}
        
        <button 
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all ${
            isWishlisted ? 'bg-secondary text-dracula-bg' : 'bg-dracula-bg/40 text-dracula-fg hover:bg-dracula-bg/60'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-dracula-bg/60 z-10 flex items-center justify-center">
            <span className="bg-dracula-comment text-dracula-fg text-xs font-bold px-4 py-2 rounded-full shadow-2xl">OUT OF STOCK</span>
          </div>
        )}
        
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          loading="lazy"
        />
        
        <Link 
          to={`/product/${id}`}
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dracula-bg/20 backdrop-blur-[1px]"
        >
          <div className="bg-white text-dracula-bg rounded-full p-3 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={22} />
          </div>
        </Link>
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-dracula-bg/90 to-transparent z-20">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock === 0}
            className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-xl shadow-primary/10"
          >
            <ShoppingCart size={16} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${id}`} className="hover:text-primary transition-colors">
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 block">{product.category}</span>
          <h3 className="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-dracula-comment text-xs mb-4 line-clamp-2 leading-relaxed opacity-80">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
          {product.averageRating && product.averageRating > 0 && (
            <div className="flex gap-1 items-center bg-dracula-bg/50 px-2 py-1 rounded-lg">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] text-white font-bold">{product.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
