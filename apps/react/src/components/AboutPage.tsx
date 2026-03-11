import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1000px] mx-auto p-4 md:p-12"
    >
      <div className="text-center mb-20">
        <h1 className="text-6xl font-black text-white mb-6 tracking-tight">Our Story</h1>
        <p className="text-xl text-dracula-comment max-w-2xl mx-auto leading-relaxed font-medium">
          Born from a passion for minimalist design and high-quality craftsmanship, Oshopper is the premier destination for the modern workspace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl">
          <Target className="text-primary mb-6" size={40} />
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-dracula-comment leading-relaxed">
            We bridge the gap between aesthetic beauty and functional excellence. Every item in our catalog is hand-selected to ensure it meets our rigorous standards for durability and design.
          </p>
        </div>
        <div className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl">
          <Users className="text-accent" size={40} />
          <h3 className="text-2xl font-bold text-white mb-4 mt-6">Our Community</h3>
          <p className="text-dracula-comment leading-relaxed">
            Oshopper isn't just a store; it's a collective of designers and enthusiasts who believe that the environment we create should inspire the life we lead.
          </p>
        </div>
      </div>

      <div className="bg-dracula-current/40 rounded-[50px] p-12 border border-white/5 text-center">
        <Globe className="text-secondary mx-auto mb-8" size={48} />
        <h2 className="text-3xl font-black text-white mb-6">Globally Sourced, Expertly Curated</h2>
        <p className="text-dracula-comment max-w-3xl mx-auto text-lg leading-relaxed">
          From independent artisans to world-renowned manufacturers, we travel the globe to bring the finest products directly to you. We handle the complexity so you can enjoy the quality.
        </p>
      </div>
    </motion.div>
  );
};
