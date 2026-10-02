import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionService } from '../../services';
import toast from 'react-hot-toast';
import { Calendar, Pause, Play, X, Package } from 'lucide-react';

const STATUS_STYLES = {
  ACTIVE: 'badge-green',
  PAUSED: 'badge-yellow',
  CANCELLED: 'badge-red',
  COMPLETED: 'badge bg-gray-100 text-gray-600',
};

export default function MySubscriptionsPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = () => {
    setLoading(true);
    subscriptionService.getMySubscriptions()
      .then(r => setSubs(r.data.data))
      .catch(() => toast.error('Failed to load subscriptions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      if (action === 'pause') await subscriptionService.pause(id);
      if (action === 'resume') await subscriptionService.resume(id);
      if (action === 'cancel') {
        if (!confirm('Are you sure you want to cancel this subscription?')) {
          setActionLoading(null);
          return;
        }
        await subscriptionService.cancel(id);
      }
      toast.success(`Subscription ${action}d successfully`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} subscription`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="py-10 min-h-screen bg-gray-50">
      <div className="page-container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title">My Subscriptions</h1>
          <Link to="/subscriptions" className="btn-primary text-sm">+ New Subscription</Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-36" />)}
          </div>
        ) : subs.length === 0 ? (
          <div className="card p-14 text-center">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No subscriptions</h2>
            <p className="text-gray-500 mb-6">Subscribe to a plan and get fresh vegetables regularly.</p>
            <Link to="/subscriptions" className="btn-primary">Explore Subscription Plans</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {subs.map(sub => (
              <div key={sub.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 font-display">{sub.SubscriptionPlan?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`badge ${STATUS_STYLES[sub.status] || 'badge-yellow'}`}>{sub.status}</span>
                      {sub.SubscriptionPlan?.frequency && (
                        <span className="text-xs text-gray-500">{sub.SubscriptionPlan.frequency}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-brand">₹{sub.SubscriptionPlan?.price}</p>
                </div>

                {sub.SubscriptionPlan?.Basket && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Package size={14} />
                    {sub.SubscriptionPlan.Basket.name}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Started</span>
                    <p className="font-medium">{new Date(sub.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  {sub.next_delivery_date && sub.status === 'ACTIVE' && (
                    <div>
                      <span className="text-gray-500 text-xs">Next Delivery</span>
                      <p className="font-medium text-brand">{new Date(sub.next_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {sub.status !== 'CANCELLED' && sub.status !== 'COMPLETED' && (
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    {sub.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleAction(sub.id, 'pause')}
                        disabled={actionLoading === sub.id + 'pause'}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-medium hover:bg-yellow-100 transition-all disabled:opacity-60"
                      >
                        <Pause size={14} /> Pause
                      </button>
                    )}
                    {sub.status === 'PAUSED' && (
                      <button
                        onClick={() => handleAction(sub.id, 'resume')}
                        disabled={actionLoading === sub.id + 'resume'}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-all disabled:opacity-60"
                      >
                        <Play size={14} /> Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleAction(sub.id, 'cancel')}
                      disabled={actionLoading === sub.id + 'cancel'}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-60"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
