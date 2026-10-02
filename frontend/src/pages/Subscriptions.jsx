import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, Calendar, Package, Sprout } from 'lucide-react';

const frequencyLabel = { ONCE: 'One-time', WEEKLY: 'Weekly', MONTHLY: 'Monthly' };

function PlanCard({ plan, onSubscribe }) {
  return (
    <div className="card-hover p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-display">{plan.name}</h3>
          <span className="badge-green mt-1">{frequencyLabel[plan.frequency]}</span>
        </div>
        {plan.discount_percent > 0 && (
          <span className="badge bg-orange-100 text-orange-700">{plan.discount_percent}% OFF</span>
        )}
      </div>

      {plan.description && (
        <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">{plan.description}</p>
      )}

      {plan.Basket && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Package size={14} />
          {plan.Basket.name}
        </div>
      )}

      <div className="border-t border-gray-100 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-brand">₹{plan.price}</span>
            <span className="text-sm text-gray-400 ml-1">/{frequencyLabel[plan.frequency].toLowerCase()}</span>
          </div>
          <button onClick={() => onSubscribe(plan)} className="btn-primary text-sm py-2.5 px-5">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    subscriptionService.getPlans()
      .then(r => setPlans(r.data.data))
      .catch(() => toast.error('Failed to load plans'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }
    setSubscribing(plan.id);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      await subscriptionService.subscribe({ plan_id: plan.id, start_date: startDate });
      toast.success(`Subscribed to ${plan.name}!`);
      navigate('/my-subscriptions');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="py-10 min-h-screen">
      <div className="bg-brand-section py-14 mb-12">
        <div className="page-container text-center">
          <h1 className="section-title mb-4">Subscription Plans</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Choose how often Palvii comes to your home. Fresh vegetables, delivered on your schedule.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* How subscriptions work */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { img: '/icon-harvest.jpg', title: 'Choose Frequency', desc: 'Weekly or monthly — whatever works for your family' },
            { img: '/icon-packing.jpg', title: 'Pick Your Basket', desc: 'Select the basket size that fits your household' },
            { img: '/icon-delivery.jpg', title: 'We Deliver', desc: 'Fresh vegetables delivered on your scheduled day' },
          ].map((item, i) => (
            <div key={i} className="card overflow-hidden text-center">
              <img src={item.img} alt={item.title} className="w-full h-36 object-cover" />
              <div className="p-5">
                <h4 className="font-semibold text-gray-900 mb-2 font-display">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Available Plans</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 card p-10">
            <Sprout size={48} className="text-brand mx-auto mb-4" />
            <p className="text-gray-500">Subscription plans coming soon. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        )}

        {/* Pause/resume note */}
        <div className="mt-12 card p-6">
          <h3 className="font-bold text-gray-900 mb-4 font-display">Flexible & Transparent</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <CheckCircle size={16} className="text-brand" />, text: 'Pause anytime — resume when you\'re ready' },
              { icon: <CheckCircle size={16} className="text-brand" />, text: 'Cancel anytime — no lock-in' },
              { icon: <CheckCircle size={16} className="text-brand" />, text: 'View next delivery in your dashboard' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                {item.icon} {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
