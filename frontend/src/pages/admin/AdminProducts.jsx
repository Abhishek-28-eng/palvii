import { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', short_description: '',
    category_id: '', unit: 'kg', price: '', original_price: '',
    min_quantity: '0.5', stock: '10', is_active: true,
    is_seasonal: false, is_featured: false,
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      productService.getAll({ limit: 100 }),
      categoryService.getAll(),
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.data);
      setCategories(cRes.data.data);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', short_description: '', category_id: '', unit: 'kg', price: '', original_price: '', min_quantity: '0.5', stock: '10', is_active: true, is_seasonal: false, is_featured: false });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p, category_id: p.category_id || '', price: String(p.price), stock: String(p.stock) });
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'name' && !editing) {
      setForm(f => ({ ...f, slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await productService.update(editing.id, form);
        toast.success('Product updated');
      } else {
        await productService.create(form);
        toast.success('Product created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Products</h1>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg font-display">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Name *</label><input name="name" value={form.name} onChange={handleChange} className="input" required /></div>
                <div><label className="label">Slug *</label><input name="slug" value={form.slug} onChange={handleChange} className="input" required /></div>
              </div>
              <div><label className="label">Category *</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} className="select" required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><label className="label">Short Description</label><input name="short_description" value={form.short_description} onChange={handleChange} className="input" /></div>
              <div><label className="label">Description</label><textarea name="description" value={form.description} onChange={handleChange} className="input h-20 resize-none" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="label">Unit</label>
                  <select name="unit" value={form.unit} onChange={handleChange} className="select">
                    <option value="kg">kg</option><option value="gm">gm</option><option value="piece">piece</option><option value="bunch">bunch</option>
                  </select>
                </div>
                <div><label className="label">Price (₹) *</label><input name="price" type="number" value={form.price} onChange={handleChange} className="input" step="0.5" required /></div>
                <div><label className="label">Stock</label><input name="stock" type="number" value={form.stock} onChange={handleChange} className="input" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Min Quantity</label><input name="min_quantity" type="number" value={form.min_quantity} onChange={handleChange} className="input" step="0.25" /></div>
              </div>
              <div className="flex gap-6">
                {[['is_active', 'Active'], ['is_seasonal', 'Seasonal'], ['is_featured', 'Featured']].map(([name, label]) => (
                  <label key={name} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="accent-brand" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? 'Save Changes' : 'Create Product'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="card p-8 animate-pulse"><div className="h-64 bg-gray-100 rounded" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.slug}</div>
                    </td>
                    <td className="p-4 text-gray-600">{p.Category?.name || '—'}</td>
                    <td className="p-4 font-semibold text-brand">₹{p.price}/{p.unit}</td>
                    <td className="p-4 text-gray-600">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        <span className={p.is_active ? 'badge-green' : 'badge-red'}>{p.is_active ? 'Active' : 'Inactive'}</span>
                        {p.is_featured && <span className="badge bg-purple-100 text-purple-700">Featured</span>}
                        {p.is_seasonal && <span className="badge bg-orange-100 text-orange-700">Seasonal</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
