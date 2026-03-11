import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Save, ArrowLeft, ShieldCheck, ShoppingBag, ListChecks, History, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderHistory } from './OrderHistory';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    bio: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      country: '',
      zip: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        phoneNumber: user.phoneNumber || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          country: user.address?.country || '',
          zip: user.address?.zip || ''
        }
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update profile' });
      }
    } catch (_err) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1000px] mx-auto p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-12 border-b border-dracula-current pb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-bold tracking-tight">Account Settings</h2>
        </div>
        <Link to="/" className="flex items-center gap-2 text-dracula-comment hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-dracula-current rounded-2xl p-8 border border-white/5 shadow-2xl flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-dracula-bg border-4 border-primary/20 flex items-center justify-center mb-6 relative group overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={64} className="text-primary/40" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
            <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-6">{user.role}</p>
            
            <div className="w-full space-y-2 mt-4">
               <button 
                onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center gap-4 transition-all text-xs uppercase tracking-widest ${activeTab === 'profile' ? 'bg-primary text-dracula-bg shadow-lg shadow-primary/20' : 'text-dracula-comment hover:bg-white/5 hover:text-white'}`}
               >
                 <User size={18} />
                 <span>My Profile</span>
               </button>
               <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center gap-4 transition-all text-xs uppercase tracking-widest ${activeTab === 'orders' ? 'bg-primary text-dracula-bg shadow-lg shadow-primary/20' : 'text-dracula-comment hover:bg-white/5 hover:text-white'}`}
               >
                 <History size={18} />
                 <span>Order History</span>
               </button>
            </div>

            <div className="w-full text-left space-y-5 pt-10 mt-10 border-t border-white/5">
              <div className="flex items-center gap-4 text-sm font-medium">
                <Mail size={18} className="text-dracula-comment" />
                <span className="text-dracula-fg/80">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <ShieldCheck size={18} className="text-accent" />
                <span className="text-dracula-fg/80">Verified Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-dracula-current rounded-2xl p-10 border border-white/5 shadow-2xl h-full">
            {message && (
               <div className={`p-4 rounded-xl mb-8 text-sm font-bold uppercase tracking-wider ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
                 {message.text}
               </div>
            )}

            {activeTab === 'profile' ? (
              <>
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-xl font-bold text-white uppercase tracking-widest">General Information</h4>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-primary transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-primary/20"
                  >
                    {isEditing ? <X size={14} /> : <Edit3 size={14} />}
                    <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
                  </button>
                </div>

                {!isEditing ? (
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] font-bold text-dracula-comment uppercase mb-4 tracking-[0.2em]">Biography</h4>
                      <p className="text-dracula-fg/90 leading-relaxed text-lg italic bg-dracula-bg/30 p-8 rounded-3xl border border-white/5">
                        {user.bio || "No biography provided. Tell the world something about your aesthetic."}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 pt-6 border-t border-white/5">
                      <div>
                        <h4 className="text-[10px] font-bold text-dracula-comment uppercase mb-4 tracking-[0.2em]">Contact Channels</h4>
                        <div className="flex items-center gap-4 bg-dracula-bg/30 p-5 rounded-2xl border border-white/5">
                           <Phone size={20} className="text-primary" />
                           <span className="text-dracula-fg/80 font-bold tracking-wider">{user.phoneNumber || 'Not linked'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-dracula-comment uppercase mb-4 tracking-[0.2em]">Primary Residence</h4>
                        <div className="space-y-2 bg-dracula-bg/30 p-5 rounded-2xl border border-white/5">
                           {user.address?.street ? (
                             <>
                               <div className="flex items-center gap-4">
                                  <MapPin size={20} className="text-primary" />
                                  <span className="text-dracula-fg/80 font-bold tracking-wider">{user.address.street}</span>
                               </div>
                               <p className="ml-9 text-xs text-dracula-comment font-medium uppercase tracking-widest mt-1">{user.address.city}, {user.address.country}</p>
                             </>
                           ) : (
                             <span className="text-dracula-comment italic text-sm">No address configured</span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Legal Full Name</label>
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                            required 
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Phone Number</label>
                          <input 
                            type="text" 
                            value={formData.phoneNumber}
                            onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                          />
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Public Bio</label>
                        <textarea 
                          value={formData.bio}
                          onChange={e => setFormData({ ...formData, bio: e.target.value })}
                          className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all min-h-[140px] resize-none shadow-inner"
                        />
                     </div>

                     <div className="pt-10 border-t border-white/5">
                        <h4 className="text-[10px] font-bold text-dracula-comment uppercase mb-8 tracking-[0.3em]">Address Verification</h4>
                        <div className="grid md:grid-cols-2 gap-6">
                           <input 
                            placeholder="Street Address"
                            value={formData.address.street}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                           />
                           <input 
                            placeholder="City"
                            value={formData.address.city}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                           />
                           <input 
                            placeholder="Country"
                            value={formData.address.country}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                           />
                           <input 
                            placeholder="Zip Code"
                            value={formData.address.zip}
                            onChange={e => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })}
                            className="w-full bg-dracula-bg border border-white/10 rounded-xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
                           />
                        </div>
                     </div>

                     <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/20 active:scale-[0.98]"
                     >
                       {loading ? <div className="w-5 h-5 border-3 border-dracula-bg border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                       <span>Update Profile Changes</span>
                     </button>
                  </form>
                )}
              </>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white uppercase tracking-widest">Order History</h4>
                  <div className="bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Recent Orders</span>
                  </div>
                </div>
                <OrderHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
