import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-dracula-current border border-white/5 shadow-2xl mb-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16">
        <div className="flex flex-col gap-8 items-start relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
            New Arrival
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            Define Your <span className="text-primary">Style</span>
          </h1>
          <p className="text-dracula-comment text-lg max-w-lg leading-relaxed">
            Curated premium essentials designed for modern comfort. Elevate your everyday workspace with Oshopper.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-dracula-bg font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
            >
              <span>Explore Collection</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-dracula-bg group">
          <img 
            alt="Premium workspace products" 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
            src="https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dracula-bg/80 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-dracula-bg/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl">
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Featured</p>
              <p className="font-bold text-lg text-white">Neo Desk Series</p>
            </div>
            <div className="bg-secondary text-dracula-bg font-bold px-4 py-2 rounded-xl text-lg shadow-xl">
              $299.00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
