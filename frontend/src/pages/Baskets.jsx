import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, ShoppingBasket } from 'lucide-react';
import { basketService } from '../services';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function BasketCard({ basket }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      id: basket.id,
      type: 'basket',
      name: basket.name,
      price: basket.price,
      unit: 'basket',
      image: basket.image,
      basket_id: basket.id,
    }, 1);
  };

  return (
    <div className="card-hover overflow-hidden flex flex-col">
      <div className="aspect-video bg-brand-cream flex items-center justify-center relative overflow-hidden">
        {basket.image ? (
          <img src={basket.image} alt={basket.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-7xl">🧺</span>
        )}
        {basket.is_trial && (
          <div className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
            FREE TRIAL
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{basket.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-grow">{basket.description}</p>

        {basket.approx_weight && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
            <Package size={12} />
            <span>Approx. {basket.approx_weight}</span>
          </div>
        )}

        {/* Basket items */}
        {basket.BasketItems && basket.BasketItems.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Includes</p>
            <div className="flex flex-wrap gap-1.5">
              {basket.BasketItems.slice(0, 6).map(item => (
                <span key={item.id} className="text-xs bg-brand-cream text-brand px-2 py-1 rounded-lg">
                  {item.Product?.name} ({item.quantity} {item.unit})
                </span>
              ))}
              {basket.BasketItems.length > 6 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">
                  +{basket.BasketItems.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            {basket.is_trial ? (
              <span className="text-2xl font-bold text-brand">FREE</span>
            ) : (
              <span className="text-2xl font-bold text-brand">₹{basket.price}</span>
            )}
          </div>
          {basket.is_trial ? (
            <Link to="/trial" className="btn-primary text-sm py-2.5 px-5">
              Request Trial <ArrowRight size={16} />
            </Link>
          ) : (
            <button onClick={handleAdd} className="btn-primary text-sm py-2.5 px-5">
              <ShoppingBasket size={16} />
              Add to Basket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BasketsPage() {
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    basketService.getAll()
      .then(r => setBaskets(r.data.data))
      .catch(() => toast.error('Failed to load baskets'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-10">
      <div className="bg-brand-section py-12 mb-10">
        <div className="page-container">
          <h1 className="section-title mb-3">Palvii Baskets</h1>
          <p className="section-subtitle max-w-xl">
            Choose the basket that fits your family. Each basket is carefully assembled with fresh, quality-checked vegetables.
          </p>
        </div>
      </div>

      <div className="page-container">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {baskets.map(b => <BasketCard key={b.id} basket={b} />)}
          </div>
        )}

        <div className="mt-14 bg-brand-section rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Not Sure Which Basket?</h3>
          <p className="text-gray-600 mb-6">Start with our free trial basket to experience the Palvii difference.</p>
          <Link to="/trial" className="btn-primary">
            Request Free Trial Basket
          </Link>
        </div>
      </div>
    </div>
  );
}
