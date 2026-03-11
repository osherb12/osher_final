import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product } from '@osher/shared';
import { ProductApi } from '../api/api';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Package, DollarSign, Image, Tag, Layers, Loader2, ArrowLeft, BarChart3, ListOrdered, TrendingUp, ShoppingBag, CheckCircle2, Truck, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '@osher/shared';

export const AdminPanel: React.FC = () => {
  const { isAdmin, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0
  });
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    const data: any = await api.get('/categories');
    if (data.success) setCategories(data.data);
    setLoading(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      const data: any = await api.post('/categories', { name: newCategoryName });
      if (data.success) {
        setNewCategoryName('');
        fetchCategories();
      }
    } catch (err: any) {
      alert(err.error || 'Error adding category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This may affect products in this category.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res = await ProductApi.getAll({ limit: 100 });
    if (res.success && res.data) setProducts(res.data.products);
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const data: any = await api.get('/orders');
    if (data.success) setAllOrders(data.data);
    setLoading(false);
  };

  const fetchStats = async () => {
    setLoading(true);
    const data: any = await api.get('/orders/stats');
    if (data.success) setStats(data.data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'products') {
        fetchProducts();
        fetchCategories();
      }
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'stats') fetchStats();
      if (activeTab === 'categories') fetchCategories();
    }
  }, [isAdmin, activeTab]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);
    try {
      const data: any = await api.post('/products', formData);
      if (data.success) {
        setFormSuccess('Product created successfully');
        setFormData({ name: '', description: '', price: 0, image: '', category: '', stock: 0 });
        fetchProducts();
      }
    } catch (err: any) {
      const errorMsg = err.details
        ? err.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join(', ')
        : (err.error || 'Error creating product');
      setFormError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const data: any = await api.delete(`/products/${id}`);
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) return <div className="p-8 text-secondary font-bold">Access Denied: Admin role required.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1200px] mx-auto p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-8 border-b border-dracula-current pb-6">
        <h2 className="text-4xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-dracula-current p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 text-xs uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-primary text-dracula-bg shadow-lg' : 'text-dracula-comment hover:text-white'}`}
            >
              <Package size={14} />
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-dracula-bg shadow-lg' : 'text-dracula-comment hover:text-white'}`}
            >
              <ListOrdered size={14} />
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 text-xs uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-primary text-dracula-bg shadow-lg' : 'text-dracula-comment hover:text-white'}`}
            >
              <Tag size={14} />
              Categories
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-primary text-dracula-bg shadow-lg' : 'text-dracula-comment hover:text-white'}`}
            >
              <BarChart3 size={14} />
              Analytics
            </button>
          </div>
          <Link to="/" className="flex items-center gap-2 text-dracula-comment hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs ml-4">
            <ArrowLeft size={16} />
            <span>Exit Admin</span>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'products' && (
          <motion.div 
            key="products"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-3 gap-12"
          >
            {/* Creation Form */}
            <div className="lg:col-span-1">
              <div className="bg-dracula-current rounded-2xl p-8 border border-white/5 shadow-2xl sticky top-24">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Plus size={22} className="text-accent" />
                  Add Product
                </h3>
                
                <form onSubmit={handleCreate} className="flex flex-col gap-5">
                  {formSuccess && (
                    <div className="bg-accent/10 border border-accent/30 text-accent text-xs font-bold px-4 py-3 rounded-xl">{formSuccess}</div>
                  )}
                  {formError && (
                    <div className="bg-secondary/10 border border-secondary/30 text-secondary text-xs font-bold px-4 py-3 rounded-xl">{formError}</div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-dracula-comment" size={16} />
                      <input
                        type="text"
                        placeholder="Premium Mech Keyboard"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      placeholder="Detailed product info..."
                      value={formData.description || ''}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-dracula-bg border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-dracula-comment" size={16} />
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price || ''}
                          onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Stock</label>
                      <input
                        type="number"
                        value={formData.stock ?? ''}
                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Image URL</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                      required
                    />
                  </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest ml-1">Category</label>
                                  <select 
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                                    required
                                  >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                  </select>
                                </div>
                                    <button 
                    type="submit" 
                    className="mt-4 bg-accent hover:bg-accent/90 text-dracula-bg font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] uppercase tracking-widest text-xs"
                  >
                    Create Product
                  </button>
                </form>
              </div>
            </div>

            {/* Product Table */}
            <div className="lg:col-span-2">
              <div className="bg-dracula-current rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-dracula-bg bg-dracula-bg/20 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-3 text-lg">
                    <Layers size={20} className="text-primary" />
                    Inventory Master
                  </h3>
                  {loading && <Loader2 className="animate-spin text-primary" size={24} />}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-dracula-bg/40 text-[10px] font-bold text-dracula-comment uppercase tracking-[0.2em] text-left">
                        <th className="px-8 py-5">Product</th>
                        <th className="px-8 py-5 text-right">Price</th>
                        <th className="px-8 py-5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map(p => (
                        <tr key={(p as any)._id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-white group-hover:text-primary transition-colors">{p.name}</span>
                              <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">{p.category} • {p.stock} units</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-sm text-primary font-bold">${p.price.toFixed(2)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center">
                              <button 
                                onClick={() => handleDelete((p as any)._id)}
                                className="p-2.5 text-dracula-comment hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-dracula-current rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
          >
            <div className="px-10 py-8 border-b border-dracula-bg bg-dracula-bg/20 flex justify-between items-center">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <ListOrdered size={24} className="text-primary" />
                System Orders
              </h3>
              {loading && <Loader2 className="animate-spin text-primary" size={24} />}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-dracula-bg/40 text-[10px] font-bold text-dracula-comment uppercase tracking-[0.2em] text-left">
                    <th className="px-10 py-6">Reference</th>
                    <th className="px-10 py-6">Customer / Items</th>
                    <th className="px-10 py-6">Total</th>
                    <th className="px-10 py-6">Status Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allOrders.map(o => (
                    <tr key={(o as any)._id || o.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-white text-sm uppercase">#{((o as any)._id || o.id || '').slice(-8)}</span>
                          <span className="text-[10px] font-bold text-dracula-comment uppercase tracking-widest">
                            {new Date(o.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm text-white font-bold">{o.address?.city}, {o.address?.country}</span>
                          <div className="flex flex-wrap gap-2">
                            {o.items.map((item, i) => (
                              <span key={i} className="text-[10px] bg-dracula-bg px-2 py-0.5 rounded border border-white/5 text-dracula-comment font-bold">
                                {item.quantity}x {item.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-primary font-black text-lg">${o.totalPrice.toFixed(2)}</td>
                      <td className="px-10 py-8">
                        <select 
                          value={o.status}
                          onChange={(e) => updateOrderStatus(((o as any)._id || o.id!), e.target.value)}
                          className={`bg-dracula-bg border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none transition-all ${
                            o.status === 'delivered' ? 'text-accent' : o.status === 'shipped' ? 'text-primary' : 'text-white'
                          }`}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-1">
              <div className="bg-dracula-current rounded-2xl p-8 border border-white/5 shadow-2xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <Plus size={22} className="text-accent" />
                  New Category
                </h3>
                <form onSubmit={handleAddCategory} className="flex flex-col gap-5">
                  <input 
                    type="text" 
                    placeholder="Category Name" 
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    className="w-full bg-dracula-bg border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:ring-1 focus:ring-accent outline-none transition-all"
                    required 
                  />
                  <button type="submit" className="bg-accent text-dracula-bg font-bold py-3 rounded-xl uppercase tracking-widest text-xs">Add Category</button>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-dracula-current rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-dracula-bg/40 text-[10px] font-bold text-dracula-comment uppercase tracking-widest text-left">
                      <th className="px-8 py-5">Name</th>
                      <th className="px-8 py-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categories.map(cat => (
                      <tr key={cat._id}>
                        <td className="px-8 py-6 text-white font-bold">{cat.name}</td>
                        <td className="px-8 py-6 text-center">
                          <button 
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-dracula-comment hover:text-secondary"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && stats && (
          <motion.div 
            key="stats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp size={40} className="text-primary opacity-20" />
                </div>
                <h4 className="text-[10px] font-bold text-dracula-comment uppercase tracking-[0.3em] mb-4">Gross Revenue</h4>
                <p className="text-4xl font-black text-white">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              
              <div className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 bg-accent/10 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag size={40} className="text-accent opacity-20" />
                </div>
                <h4 className="text-[10px] font-bold text-dracula-comment uppercase tracking-[0.3em] mb-4">Orders Processed</h4>
                <p className="text-4xl font-black text-white">{stats.totalOrders}</p>
              </div>

              <div className="bg-dracula-current p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 bg-secondary/10 w-24 h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package size={40} className="text-secondary opacity-20" />
                </div>
                <h4 className="text-[10px] font-bold text-dracula-comment uppercase tracking-[0.3em] mb-4">Total SKU Count</h4>
                <p className="text-4xl font-black text-white">{stats.productCount ?? 0}</p>
              </div>
            </div>

            <div className="bg-dracula-current rounded-[40px] border border-white/5 p-10 shadow-2xl">
              <h4 className="text-xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                <TrendingUp size={24} className="text-primary" />
                Best Selling Products
              </h4>
              <div className="space-y-4">
                {stats.topProducts.map((p: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-dracula-bg/40 p-6 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                        {i + 1}
                      </div>
                      <span className="text-white font-bold text-lg group-hover:text-primary transition-colors">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-white">{p.count} Units Sold</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
