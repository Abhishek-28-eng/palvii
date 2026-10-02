import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services';
import toast from 'react-hot-toast';
import { CheckCircle, MapPin, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { items, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: '',
    address_line1: '',
    area: '',
    society: '',
    pincode: '',
    preferred_delivery_date: '',
    preferred_delivery_time: '',
    payment_method: 'CASH',
    customer_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: address, 2: payment, 3: success
  const [orderNumber, setOrderNumber] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center page-container">
        <h2 className="text-2xl font-bold mb-4">Login to Checkout</h2>
        <p className="text-gray-500 mb-6">Please log in to place your order.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/basket');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address_line1) {
      toast.error('Please enter your delivery address');
      return;
    }

    setLoading(true);
    try {
      const delivery_address = {
        name: form.name,
        mobile: form.mobile,
        address_line1: form.address_line1,
        area: form.area,
        society: form.society,
        pincode: form.pincode,
      };

      const orderItems = items.map(item => ({
        product_id: item.product_id || null,
        basket_id: item.basket_id || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      }));

      const res = await orderService.create({
        items: orderItems,
        delivery_address,
        preferred_delivery_date: form.preferred_delivery_date || null,
        preferred_delivery_time: form.preferred_delivery_time || null,
        payment_method: form.payment_method,
        customer_notes: form.customer_notes,
      });

      setOrderNumber(res.data.data.order_number);
      clearCart();
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="py-20 page-container">
        <div className="max-w-lg mx-auto card p-10 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 font-display">Order Placed!</h1>
          <p className="text-gray-600 mb-2">Your Palvii order has been received.</p>
          <div className="bg-brand-cream rounded-xl p-4 my-6">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-xl font-bold text-brand">{orderNumber}</p>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            We'll confirm your order and let you know the delivery schedule. For any queries, contact us on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate('/my-orders')} className="btn-primary flex-1">View My Orders</button>
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="page-container">
        <h1 className="section-title mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Info */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2 font-display">
                  <MapPin size={18} className="text-brand" />
                  Delivery Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input name="name" className="input" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="label">Mobile *</label>
                    <input name="mobile" type="tel" className="input" value={form.mobile} onChange={handleChange} required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Delivery Address *</label>
                    <textarea name="address_line1" className="input h-20 resize-none" value={form.address_line1} onChange={handleChange} required placeholder="Flat no, building name, street..." />
                  </div>
                  <div>
                    <label className="label">Area / Locality</label>
                    <input name="area" className="input" value={form.area} onChange={handleChange} placeholder="e.g. Baner" />
                  </div>
                  <div>
                    <label className="label">Society / Apartment</label>
                    <input name="society" className="input" value={form.society} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">Pincode</label>
                    <input name="pincode" className="input" value={form.pincode} onChange={handleChange} maxLength={6} />
                  </div>
                  <div>
                    <label className="label">Preferred Delivery Date</label>
                    <input name="preferred_delivery_date" type="date" className="input" value={form.preferred_delivery_date} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="label">Preferred Time Slot</label>
                    <select name="preferred_delivery_time" className="select" value={form.preferred_delivery_time} onChange={handleChange}>
                      <option value="">Any time</option>
                      <option value="6AM-9AM">6 AM – 9 AM</option>
                      <option value="9AM-12PM">9 AM – 12 PM</option>
                      <option value="4PM-7PM">4 PM – 7 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2 font-display">
                  <CreditCard size={18} className="text-brand" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'CASH', label: 'Cash on Delivery', desc: 'Pay when we deliver', emoji: '💵' },
                    { value: 'UPI', label: 'UPI Payment', desc: 'Pay via UPI (confirmation on WhatsApp)', emoji: '📱' },
                  ].map(m => (
                    <label key={m.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment_method === m.value ? 'border-brand bg-brand-cream' : 'border-gray-200 hover:border-brand/50'}`}>
                      <input type="radio" name="payment_method" value={m.value} checked={form.payment_method === m.value} onChange={handleChange} className="accent-brand" />
                      <span className="text-xl">{m.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-900">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="card p-6">
                <label className="label">Order Notes (optional)</label>
                <textarea name="customer_notes" className="input h-20 resize-none" value={form.customer_notes} onChange={handleChange} placeholder="Any special instructions..." />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
                {loading ? 'Placing order...' : '🌿 Place My Order'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5 font-display">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={`${item.id}-${item.type}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                    <span className="font-medium flex-shrink-0">₹{(parseFloat(item.price) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-brand' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-brand">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
