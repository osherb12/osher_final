import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useCartDrawer } from '../context/CartDrawerContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Search, 
  Heart, 
  User as UserIcon, 
  ShoppingCart, 
  LogOut, 
  LayoutDashboard, 
  Store,
  Sun,
  Moon,
  LogIn,
  Package,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalPrice, items } = useCart();
  const { wishlistIds } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { toggleDrawer } = useCartDrawer();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dracula-current bg-dracula-bg/95 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="text-primary w-7 h-7" />
            <h1 className="text-xl font-bold tracking-tight">Oshopper</h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-grow max-w-lg items-center">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
                <Search size={18} />
              </div>
              <input 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="block w-full rounded-md border border-dracula-current bg-dracula-bg/50 py-2 pl-10 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Search products..." 
                type="text"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/products" title="Catalog" className="text-dracula-comment hover:text-primary transition-colors p-2">
              <Package size={20} />
            </Link>

            <button onClick={toggleTheme} className="text-dracula-comment hover:text-primary transition-colors p-2">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link to="/wishlist" className="relative text-dracula-comment hover:text-primary transition-colors p-2">
              <Heart size={20} className={wishlistIds.length > 0 ? "fill-secondary text-secondary" : ""} />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-dracula-bg">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <button 
                    onClick={() => navigate(isAdminRoute ? '/' : '/admin')}
                    className={`text-dracula-comment hover:text-primary transition-colors p-2 ${isAdminRoute ? 'text-primary' : ''}`}
                  >
                    {isAdminRoute ? <Store size={20} /> : <LayoutDashboard size={20} />}
                  </button>
                )}

                <Link to="/profile" className="text-dracula-comment hover:text-primary transition-colors p-2">
                  <UserIcon size={20} />
                </Link>

                <button onClick={logout} className="text-dracula-comment hover:text-secondary transition-colors p-2">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-dracula-comment hover:text-primary transition-colors p-2 text-sm font-medium">
                <LogIn size={18} />
                <span className="hidden sm:inline uppercase tracking-wider text-xs">Sign In</span>
              </Link>
            )}

            <button 
              onClick={toggleDrawer}
              className="relative flex items-center gap-2 rounded-md bg-dracula-current px-3 py-1.5 text-sm font-medium text-dracula-fg hover:bg-dracula-current/80 transition-all border border-transparent hover:border-primary/30"
            >
              <ShoppingCart size={18} />
              <span className="text-xs font-semibold hidden sm:inline">${totalPrice.toFixed(2)}</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-dracula-bg">
                  {items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
