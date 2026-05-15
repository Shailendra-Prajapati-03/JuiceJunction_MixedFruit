import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Search, Filter, 
  MoreVertical, Check, X, Tag, Package, Clock, Info
} from 'lucide-react';
import api from '../../utils/api';
import { useStore } from '../../store/useStore';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  stock_quantity: number;
  is_available: boolean;
  delivery_time: number;
  nutrition_info: any;
  tags: string;
}

const VendorProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
<<<<<<< HEAD
      const res = await api.get('/api/vendor/products/');
=======
      const res = await api.get('/vendor/products/');
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
<<<<<<< HEAD
      await api.delete(`/api/vendor/products/${id}/`);
=======
      await api.delete(`/vendor/products/${id}/`);
>>>>>>> 18a190e7792a47b11a997af80c50d0ff5ace506d
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage <span className="text-primary-500">Products</span></h1>
          <p className="text-slate-500 font-medium mt-1">Add, edit, or remove your shop's offerings.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="px-6 py-3 bg-primary-500 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all font-medium text-slate-600"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Products Table/Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/20" />
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Package size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">No products found. Start by adding one!</p>
                    </div>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={20} /></div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{product.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {product.delivery_time} mins</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-black ${product.stock_quantity < 10 ? 'text-red-500' : 'text-slate-900'}`}>
                        {product.stock_quantity}
                      </span>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${product.stock_quantity < 10 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, product.stock_quantity)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {product.is_available ? (
                      <span className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase tracking-widest">
                        <Check size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-[10px] font-black uppercase tracking-widest">
                        <X size={12} /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary-500 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
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
  );
};

export default VendorProducts;
