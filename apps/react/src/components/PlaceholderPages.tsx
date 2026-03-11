import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PlaceholderPage: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-[800px] mx-auto py-20 text-center flex flex-col items-center gap-6"
  >
    <div className="p-6 bg-dracula-current rounded-full text-primary shadow-xl">
      {icon}
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-3xl font-bold">{title} Under Construction<span className="text-secondary animate-pulse">_</span></h2>
      <p className="text-dracula-comment font-mono text-sm">// This module is currently being compiled. Stay tuned.</p>
    </div>
    <Link to="/" className="mt-8 flex items-center gap-2 text-primary hover:underline font-mono">
      <ArrowLeft size={18} />
      <span>git checkout main</span>
    </Link>
  </motion.div>
);
