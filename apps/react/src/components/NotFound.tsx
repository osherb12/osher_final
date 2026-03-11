import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dracula-current/40 border border-white/5 p-12 rounded-3xl max-w-md w-full shadow-2xl"
      >
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <Ghost size={48} className="text-primary animate-bounce" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-6">Oops! Lost in Orbit?</h2>
        <p className="text-dracula-comment mb-10 leading-relaxed font-medium">
          The page or product you're looking for has drifted into deep space or never existed.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link 
            to="/products" 
            className="w-full bg-primary text-dracula-bg font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all uppercase tracking-widest text-sm shadow-lg shadow-primary/20"
          >
            <ShoppingBag size={18} />
            Explore Products
          </Link>
          <Link 
            to="/" 
            className="w-full py-4 text-dracula-comment hover:text-white transition-colors font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
