import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Product } from '@osher/shared';
import { ProductApi } from './api/api';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminPanel } from './components/AdminPanel';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProductPage } from './components/ProductPage';
import { WishlistPage } from './components/WishlistPage';
import { ProductsPage } from './components/ProductsPage';
import { ProfilePage } from './components/ProfilePage';
import { NotFound } from './components/NotFound';
import { Checkout } from './components/Checkout';
import { OrderSuccess } from './components/OrderSuccess';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { CartProvider } from './context/CartContext';

// Existing imports...
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartDrawerProvider, useCartDrawer } from './context/CartDrawerContext';
import { WishlistProvider } from './context/WishlistContext';
import { Loader2, X, ShoppingBag, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC<{ products: Product[]; loading: boolean; error: string | null }> = ({ products, loading, error }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <Hero />
    
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-dracula-current pb-6 text-white">
      <h2 className="text-3xl font-bold tracking-tight">Latest Arrivals</h2>
      <span className="text-xs font-bold text-dracula-comment uppercase tracking-[0.2em]">Featured Catalog</span>
    </div>

    {loading ? (
      <div className="py-24 flex flex-col items-center gap-4 text-dracula-comment">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs">Loading Catalog</p>
      </div>
    ) : error ? (
      <div className="py-24 text-center text-secondary">
        <p className="font-bold text-lg">System connection failure</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 border border-secondary rounded-xl hover:bg-secondary/10 transition-all font-bold uppercase tracking-widest text-xs">Retry Connection</button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => (
          <ProductCard key={(p as any)._id || p.id} product={p} />
        ))}
      </div>
    )}
  </motion.div>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <div className="mb-12 flex flex-col items-center gap-3">
        <ShoppingBag className="text-primary w-12 h-12" />
        <h1 className="text-4xl font-bold tracking-tight text-white">Oshopper</h1>
      </div>
      <AnimatePresence mode="wait">
        {isLogin ? (
          <Login key="login" onToggle={() => setIsLogin(false)} />
        ) : (
          <Register key="register" onToggle={() => setIsLogin(true)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const CartSidebar = () => {
  const { isOpen, closeDrawer } = useCartDrawer();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-dracula-bg/80 backdrop-blur-md z-[60]"
          />
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-dracula-bg border-l border-white/5 z-[70] shadow-2xl flex flex-col"
          >
            <div className="absolute top-6 right-6 z-[80]">
              <button onClick={closeDrawer} className="p-2 hover:bg-white/5 rounded-full text-dracula-comment hover:text-white transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto no-scrollbar">
              <Cart />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    ProductApi.getAll({ limit: 8 }).then(res => {
      if (res.success && res.data) setProducts(res.data.products);
      else setError(res.error || 'Failed to load products');
      setLoading(false);
    }).catch(_err => {
      setError('Network error');
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-dracula-bg text-dracula-fg flex flex-col">
      <Navbar />
      <CartSidebar />
      
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage products={products} loading={loading} error={error} />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <CartDrawerProvider>
                  <AppRoutes />
                </CartDrawerProvider>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-dracula-bg text-white flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-secondary/10 p-6 rounded-full mb-8">
          <AlertTriangle size={64} className="text-secondary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Critical System Fault</h1>
        <p className="mb-10 text-dracula-comment max-w-md leading-relaxed">
          The application encountered an unrecoverable error. Your session data has been preserved, but a reload is required.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-10 py-4 bg-primary text-dracula-bg rounded-2xl font-bold hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-sm flex items-center gap-3 shadow-2xl shadow-primary/20"
        >
          <RefreshCw size={18} />
          Restart Application
        </button>
      </div>
    );
    return this.props.children;
  }
}

export default App;
