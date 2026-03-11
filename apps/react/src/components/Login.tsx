import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginInput } from '@osher/shared';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const Login: React.FC<{ onToggle: () => void }> = ({ onToggle }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await login(formData);
      if (!res.success) {
        setError(res.error || 'Login failed');
      }
    } catch (_err) {
      setError('Network error: Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dracula-current rounded-xl p-8 border border-white/5 shadow-2xl w-full max-w-[400px]"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dracula-fg mb-2">Welcome Back</h2>
        <p className="text-dracula-comment text-sm">Please sign in to your account</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-secondary/20 border border-secondary/30 text-secondary text-xs p-3 rounded mb-6"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
              <User size={16} />
            </div>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-4 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment/50 focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              required 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-dracula-comment uppercase tracking-widest ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
              <Lock size={16} />
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-4 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment/50 focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              required 
            />
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-xs text-dracula-comment">
          Don't have an account? {' '}
          <span 
            onClick={onToggle}
            className="text-primary font-bold cursor-pointer hover:underline decoration-primary underline-offset-4"
          >
            Create an Account
          </span>
        </p>
      </div>
    </motion.div>
  );
};
