import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductApi, ProductQuery } from '../api/api';
import api from '../api/api';
import { Product } from '@osher/shared';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import { ProductSkeleton } from './SkeletonLoader';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'price_asc';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.get('/categories')
      .then((data: any) => {
        if (data.success) {
          setCategories(['All', ...data.data.map((c: any) => c.name)]);
        }
      });
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query: ProductQuery = { 
        page, 
        limit: 8, 
        category, 
        search, 
        sort, 
        minPrice: minPrice ? Number(minPrice) : undefined, 
        maxPrice: maxPrice ? Number(maxPrice) : undefined 
      };
      const res = await ProductApi.getAll(query);
      if (res.success && res.data) {
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
        setCurrentPage(res.data.current);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort, page, minPrice, maxPrice]);

  const updateFilters = (updates: Partial<{ category: string, search: string, sort: string, page: number, minPrice: string, maxPrice: string }>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || (value === 'All' && key === 'category') || (value === '' && (key === 'minPrice' || key === 'maxPrice'))) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    if (!updates.hasOwnProperty('page')) newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto p-4 md:p-8"
    >
      <div className="flex flex-col gap-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dracula-current pb-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-white">Catalog</h2>
            <p className="text-dracula-comment text-sm mt-2 font-medium uppercase tracking-[0.2em]">Explore Our Collection</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dracula-comment group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full bg-dracula-current border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-dracula-current border border-white/5 rounded-xl p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-dracula-bg' : 'text-dracula-comment hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-dracula-bg' : 'text-dracula-comment hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>

            <select 
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="bg-dracula-current border border-white/5 rounded-xl py-3 px-4 text-sm text-dracula-fg focus:ring-1 focus:ring-primary outline-none cursor-pointer font-medium"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>

            <div className="flex items-center gap-2 bg-dracula-current border border-white/5 rounded-xl px-4 py-1.5 shadow-inner">
              <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest mr-2">Price</span>
              <input 
                type="number" 
                placeholder="Min" 
                value={minPrice}
                onChange={(e) => updateFilters({ minPrice: e.target.value })}
                className="w-16 bg-transparent text-xs text-white outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
              />
              <span className="text-dracula-comment text-xs">—</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={maxPrice}
                onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                className="w-16 bg-transparent text-xs text-white outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilters({ category: cat })}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap tracking-wider ${
                category === cat 
                ? 'bg-primary text-dracula-bg border-primary shadow-lg shadow-primary/20' 
                : 'bg-dracula-current text-dracula-comment border-transparent hover:border-dracula-comment/30'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center flex flex-col items-center gap-6"
            >
              <div className="bg-dracula-current p-6 rounded-full">
                <SlidersHorizontal size={40} className="text-dracula-comment opacity-40" />
              </div>
              <div>
                <p className="text-white text-xl font-bold">No results found</p>
                <p className="text-dracula-comment mt-1">Try adjusting your filters or search terms.</p>
              </div>
              <button 
                onClick={() => setSearchParams({})} 
                className="px-6 py-2 bg-dracula-current text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-all font-bold text-sm"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-4"}
            >
              {viewMode === 'list' && (
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-dracula-current/50 rounded-xl text-[10px] font-bold text-dracula-comment uppercase tracking-widest border border-white/5">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
              )}
              {products.map(p => (
                viewMode === 'grid' ? (
                  <ProductCard key={(p as any)._id || p.id} product={p} />
                ) : (
                  <div key={(p as any)._id || p.id} className="bg-dracula-current border border-white/5 rounded-xl p-4 md:px-6 flex flex-col md:grid md:grid-cols-12 items-center gap-4 hover:border-primary/30 transition-all group">
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dracula-bg">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-dracula-comment text-xs line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                    <div className="col-span-2 w-full md:w-auto">
                      <span className="px-3 py-1 rounded-full bg-dracula-bg text-[10px] font-bold text-dracula-comment uppercase tracking-wider border border-white/5">
                        {p.category}
                      </span>
                    </div>
                    <div className="col-span-2 w-full md:w-auto">
                      <span className="text-primary font-bold">${p.price.toFixed(2)}</span>
                    </div>
                    <div className="col-span-2 w-full md:flex justify-end">
                      <button 
                        onClick={() => window.location.href = `/product/${(p as any)._id || p.id}`}
                        className="w-full md:w-auto px-4 py-2 bg-dracula-bg hover:bg-primary hover:text-dracula-bg text-white rounded-lg text-xs font-bold transition-all border border-white/5 hover:border-primary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="mt-20 flex items-center justify-center gap-3 border-t border-dracula-current pt-10">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-3 bg-dracula-current rounded-xl hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-12 h-12 rounded-xl text-sm transition-all font-bold ${
                  currentPage === i + 1 
                  ? 'bg-primary text-dracula-bg shadow-lg shadow-primary/20' 
                  : 'bg-dracula-current text-dracula-comment hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-3 bg-dracula-current rounded-xl hover:bg-white/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
};
