import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data: any = await api.post('/contact', formData);
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err: any) {
      setError(err.error || 'Connection error: Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-[1200px] mx-auto p-4 md:p-12"
    >
      <div className="grid md:grid-cols-2 gap-20">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tight">Contact Us</h1>
            <p className="text-xl text-dracula-comment leading-relaxed max-w-md font-medium">
              We're here to help. Whether you have a question about our products or need assistance with an order, our team is ready to assist you.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 group">
              <div className="bg-primary/10 p-5 rounded-2xl border border-primary/20 group-hover:bg-primary transition-all group-hover:text-dracula-bg text-primary">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mb-1">Email Our Team</p>
                <p className="text-xl font-bold text-white tracking-tight">support@oshopper.com</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="bg-accent/10 p-5 rounded-2xl border border-accent/20 group-hover:bg-accent transition-all group-hover:text-dracula-bg text-accent">
                <MessageCircle size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mb-1">Customer Support</p>
                <p className="text-xl font-bold text-white tracking-tight">Mon - Fri, 9am - 6pm EST</p>
              </div>
            </div>

            <div className="flex items-center gap-6 group">
              <div className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20 group-hover:bg-secondary transition-all group-hover:text-dracula-bg text-secondary">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mb-1">Office Location</p>
                <p className="text-xl font-bold text-white tracking-tight">Silicon Valley, CA, USA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dracula-current p-12 rounded-[50px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all"></div>
          
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10"
            >
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <CheckCircle2 size={48} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully</h3>
              <p className="text-dracula-comment leading-relaxed mb-8">
                Thank you for reaching out. A support representative will review your message and respond within one business day.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-dracula-bg border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-dracula-bg border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-dracula-bg border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all min-h-[150px] resize-none" 
                  />
                </div>
                
                {error && <p className="text-secondary text-xs font-bold uppercase tracking-widest px-1">{error}</p>}

                <button 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-dracula-bg font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-primary/20 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-dracula-bg border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
