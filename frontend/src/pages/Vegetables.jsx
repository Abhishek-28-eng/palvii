import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingBasket, ChevronDown } from 'lucide-react';
import { productService, categoryService } from '../services';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(product.min_quantity || 0.5);

  const handleAdd = () => {
    addItem({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      product_id: product.id,
      min_quantity: product.min_quantity,
    }, qty);
  };

  return (
    <div className="card-hover group overflow-hidden">
      {/* Image */}
      <div className="aspect-square bg-brand-cream flex items-center justify-center relative overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-200">🥬</span>
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 badge-green text-xs">Featured</span>
        )}
        {product.is_seasonal && (
          <span className="absolute top-3 right-3 badge bg-orange-100 text-orange-700 text-xs">Seasonal</span>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 font-display">{product.name}</h3>
        {product.short_description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.short_description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-brand">₹{product.price}</span>
            <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
          </div>
          {product.Category && (
            <span className="text-xs text-gray-400">{product.Category.name}</span>
          )}
        </div>

        {/* Quantity + Add */}
        {product.stock > 0 ? (
          <div className="flex gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(product.min_quantity || 0.25, qty - (product.unit === 'piece' || product.unit === 'bunch' ? 1 : 0.25)))}
                className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 text-sm font-medium"
              >−</button>
              <span className="px-2 text-sm font-medium min-w-[2rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + (product.unit === 'piece' || product.unit === 'bunch' ? 1 : 0.25))}
                className="px-2.5 py-2 text-gray-500 hover:bg-gray-50 text-sm font-medium"
              >+</button>
            </div>
            <button onClick={handleAdd} className="flex-1 btn-primary text-sm py-2 px-3">
              <ShoppingBasket size={14} />
              Add
            </button>
          </div>
        ) : (
          <button disabled className="w-full text-sm py-2 px-4 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

export default function VegetablesPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', seasonal: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    categoryService.getAll().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.seasonal === 'true') params.seasonal = 'true';

    productService.getAll(params)
      .then(r => {
        setProducts(r.data.data);
        setPagination(r.data.pagination);
      })
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  }, [filters, page]);

  const handleFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: value }));
    setPage(1);
  };

  return (
    <div className="py-10 min-h-screen">
      {/* Header */}
      <div className="bg-brand-section py-12 mb-10">
        <div className="page-container">
          <h1 className="section-title mb-2">Our Vegetables</h1>
          <p className="section-subtitle">Fresh from our farms — sorted, quality-checked and ready for your kitchen.</p>
        </div>
      </div>

      <div className="page-container">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="input pl-11"
              placeholder="Search vegetables..."
              value={filters.search}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          <select
            className="select sm:w-52"
            value={filters.category}
            onChange={(e) => handleFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            className="select sm:w-44"
            value={filters.seasonal}
            onChange={(e) => handleFilter('seasonal', e.target.value)}
          >
            <option value="">All Vegetables</option>
            <option value="true">Seasonal Only</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => handleFilter('category', '')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!filters.category ? 'bg-brand text-white' : 'bg-white text-gray-600 hover:bg-brand-cream border border-gray-200'}`}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => handleFilter('category', c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.category === c.id ? 'bg-brand text-white' : 'bg-white text-gray-600 hover:bg-brand-cream border border-gray-200'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vegetables found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-cream'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
