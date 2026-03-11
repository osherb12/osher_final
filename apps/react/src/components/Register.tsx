import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RegisterInput } from '@osher/shared';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Loader2, Phone, MapPin, AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';

export const Register: React.FC<{ onToggle: () => void }> = ({ onToggle }) => {
  const { register } = useAuth();
  const [showOptional, setShowOptional] = useState(false);
  const [formData, setFormData] = useState<RegisterInput>({ 
    name: '', 
    email: '', 
    password: '',
    role: 'user',
    bio: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      zip: '',
      country: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await register(formData);
      if (!res.success) {
        if ((res as any).details) {
          const detailMsgs = (res as any).details.map((d: any) => d.message).join('\n');
          setError(detailMsgs);
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    } catch (_err) {
      setError('Network error: Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dracula-current rounded-xl p-8 border border-white/5 shadow-2xl w-full max-w-[450px]"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-dracula-fg mb-2">Create Account</h2>
        <p className="text-dracula-comment text-sm">Join our community of enthusiasts</p>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Full Name *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
              <User size={14} />
            </div>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-3 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              required 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Email Address *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
              <Mail size={14} />
            </div>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-3 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              required 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Password *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
              <Lock size={14} />
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-3 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
              required 
            />
          </div>
        </div>

        {/* Optional Fields Toggle */}
        <button 
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center justify-between py-2 text-[10px] font-bold text-dracula-comment hover:text-primary transition-colors uppercase tracking-widest border-y border-white/5 mt-2"
        >
          <span>Additional Profile Details (Optional)</span>
          {showOptional ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <AnimatePresence>
          {showOptional && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
                    <Phone size={14} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="+1 (555) 000-0000" 
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-3 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Bio</label>
                <div className="relative group">
                  <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none text-dracula-comment group-focus-within:text-primary transition-colors">
                    <AlignLeft size={14} />
                  </div>
                  <textarea 
                    placeholder="Tell us a bit about yourself..." 
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    className="block w-full rounded-xl border border-white/10 bg-dracula-bg py-3 pl-12 pr-4 text-dracula-fg placeholder:text-dracula-comment focus:ring-1 focus:ring-primary focus:border-transparent outline-none text-sm transition-all min-h-[80px] resize-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mb-3 ml-1">Address Information</p>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    placeholder="Street" 
                    value={formData.address?.street}
                    onChange={e => setFormData({ ...formData, address: { ...formData.address!, street: e.target.value } })}
                    className="rounded-xl border border-white/10 bg-dracula-bg py-3 px-4 text-dracula-fg text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                  <input 
                    placeholder="City" 
                    value={formData.address?.city}
                    onChange={e => setFormData({ ...formData, address: { ...formData.address!, city: e.target.value } })}
                    className="rounded-xl border border-white/10 bg-dracula-bg py-3 px-4 text-dracula-fg text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                  <input 
                    placeholder="Zip" 
                    value={formData.address?.zip}
                    onChange={e => setFormData({ ...formData, address: { ...formData.address!, zip: e.target.value } })}
                    className="rounded-xl border border-white/10 bg-dracula-bg py-3 px-4 text-dracula-fg text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                  <input 
                    placeholder="Country" 
                    value={formData.address?.country}
                    onChange={e => setFormData({ ...formData, address: { ...formData.address!, country: e.target.value } })}
                    className="rounded-xl border border-white/10 bg-dracula-bg py-3 px-4 text-dracula-fg text-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-dracula-comment">
          Already have an account? {' '}
          <span 
            onClick={onToggle}
            className="text-accent font-bold cursor-pointer hover:underline decoration-accent underline-offset-4"
          >
            Sign In
          </span>
        </p>
      </div>
    </motion.div>
  );
};
