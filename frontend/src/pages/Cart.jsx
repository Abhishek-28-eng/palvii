import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBasket, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { openWhatsApp } from '../utils/whatsapp';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryCharge, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center page-container">
        <div className="text-7xl mb-6">🧺</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3 font-display">Your basket is empty</h1>
        <p className="text-gray-500 mb-8">Add some fresh vegetables or a basket to get started.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/vegetables" className="btn-primary">Browse Vegetables</Link>
          <Link to="/baskets" className="btn-secondary">View Baskets</Link>
        </div>
      </div>
    );
  }

  const whatsAppMessage = `Hi Palvii! I'd like to order:\n${items.map(i => `• ${i.name} × ${i.quantity} ${i.unit}`).join('\n')}\n\nTotal: ₹${total.toFixed(0)}\n\nPlease help me place this order.`;

  return (
    <div className="py-10 min-h-screen">
      <div className="page-container">
        <h1 className="section-title mb-8">Your Basket</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={`${item.id}-${item.type}`} className="card p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0 text-2xl overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  ) : item.type === 'basket' ? '🧺' : '🥬'}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price} / {item.unit}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity - (item.unit === 'piece' || item.unit === 'bunch' || item.type === 'basket' ? 1 : 0.25))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 text-sm font-medium min-w-[3rem] text-center">{item.quantity} {item.unit}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.type, item.quantity + (item.unit === 'piece' || item.unit === 'bunch' || item.type === 'basket' ? 1 : 0.25))}
                    className="px-3 py-2 text-gray-500 hover:bg-gray-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right min-w-[4rem]">
                  <p className="font-semibold text-gray-900">₹{(parseFloat(item.price) * item.quantity).toFixed(0)}</p>
                </div>

                <button
                  onClick={() => removeItem(item.id, item.type)}
                  className="text-red-400 hover:text-red-600 p-1 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({Math.round(itemCount)} items)</span>
                  <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-brand font-medium' : 'font-medium'}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-400">Free delivery on orders above ₹300</p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-brand">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full text-center block py-3.5 mb-3">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <button
                onClick={() => openWhatsApp(whatsAppMessage)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-all text-sm font-medium border border-green-200"
              >
                <MessageCircle size={16} />
                Order on WhatsApp Instead
              </button>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/vegetables" className="text-sm text-brand hover:text-brand-light transition-colors flex items-center gap-1">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
