import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code, Mail, Rss, Github, Twitter, Instagram, Disc as Discord } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dracula-bg border-t border-dracula-current pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-primary w-6 h-6" />
              <h2 className="text-lg font-bold">Oshopper_</h2>
            </div>
            <p className="text-dracula-comment text-sm leading-relaxed mb-6 max-w-sm">
              Curated gear for developers, by developers. We believe in quality tools that enhance your productivity and spark joy in your daily workflow.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="text-dracula-comment hover:text-white transition-colors"><Code size={20} /></Link>
              <a href="mailto:support@oshopper.com" className="text-dracula-comment hover:text-white transition-colors"><Mail size={20} /></a>
              <a href="javascript:void(0)" className="text-dracula-comment hover:text-white transition-colors cursor-default"><Rss size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-dracula-comment">
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/products">All Products</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/products?category=Keyboards">Keyboards</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/products?category=Accessories">Accessories</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/products?category=Desk Mats">Desk Mats</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-dracula-comment">
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/about">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/faq">Shipping & Returns</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/faq">FAQ</Link></li>
              <li><Link className="hover:text-primary transition-colors hover:underline decoration-primary decoration-2 underline-offset-4" to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-white mb-4">Community</h3>
            <ul className="space-y-3 text-sm text-dracula-comment flex flex-col">
              <li className="flex items-center gap-2"><Discord size={14} /><a className="hover:text-primary transition-colors" href="javascript:void(0)">Discord</a></li>
              <li className="flex items-center gap-2"><Twitter size={14} /><a className="hover:text-primary transition-colors" href="javascript:void(0)">Twitter</a></li>
              <li className="flex items-center gap-2"><Github size={14} /><a className="hover:text-primary transition-colors" href="https://github.com">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dracula-current pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-dracula-comment font-mono">© 2026 Oshopper. All systems operational.</p>
          <div className="flex gap-6">
            <span className="text-xs text-dracula-comment font-mono cursor-pointer hover:text-white">Privacy</span>
            <span className="text-xs text-dracula-comment font-mono cursor-pointer hover:text-white">Terms</span>
            <span className="text-xs text-dracula-comment font-mono cursor-pointer hover:text-white">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
