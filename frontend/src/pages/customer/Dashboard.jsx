import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBasket, Calendar, Package, Settings, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService, subscriptionService } from '../../services';
import { openWhatsApp, whatsAppMessages } from '../../utils/whatsapp';

const STATUS_COLORS = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-blue',
  PACKING: 'badge-blue',
  READY_FOR_DELIVERY: 'badge-blue',
  OUT_FOR_DELIVERY: 'badge-blue',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
  ACTIVE: 'badge-green',
  PAUSED: 'badge-yellow',
  CANCELLED_SUB: 'badge-red',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getMyOrders(),
      subscriptionService.getMySubscriptions(),
    ]).then(([ordersRes, subsRes]) => {
      setRecentOrders(ordersRes.data.data.slice(0, 3));
      setSubscriptions(subsRes.data.data.filter(s => s.status === 'ACTIVE'));
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { icon: <ShoppingBasket size={22} />, label: 'Order Basket', to: '/baskets', color: 'bg-brand-cream text-brand' },
    { icon: <Package size={22} />, label: 'My Orders', to: '/my-orders', color: 'bg-blue-50 text-blue-600' },
    { icon: <Calendar size={22} />, label: 'Subscriptions', to: '/my-subscriptions', color: 'bg-purple-50 text-purple-600' },
    { icon: <Settings size={22} />, label: 'My Profile', to: '/profile', color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className="py-10 min-h-screen bg-gray-50">
      <div className="page-container">
        {/* Welcome */}
        <div className="bg-brand rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display">Welcome, {user?.name?.split(' ')[0]}! </h1>
              <p className="text-green-200 text-sm mt-1">Manage your orders, subscriptions and more.</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.to} className="card p-5 flex flex-col items-center gap-2 text-center hover:shadow-card-hover transition-all hover:-translate-y-0.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 font-display">Recent Orders</h2>
              <Link to="/my-orders" className="text-sm text-brand hover:text-brand-light flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBasket size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No orders yet</p>
                <Link to="/baskets" className="btn-primary text-sm mt-4">Order Your First Basket</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <Link key={order.id} to={`/my-orders/${order.id}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-cream transition-all">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{order.order_number}</p>
                      <p className="text-xs text-gray-500">₹{order.total} · {order.OrderItems?.length || 0} items</p>
                    </div>
                    <span className={`badge text-xs ${STATUS_COLORS[order.status] || 'badge-yellow'}`}>
                      {order.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Active Subscriptions */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 font-display">Active Subscriptions</h2>
              <Link to="/my-subscriptions" className="text-sm text-brand hover:text-brand-light flex items-center gap-1">
                Manage <ArrowRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-2">No active subscriptions</p>
                <Link to="/subscriptions" className="btn-primary text-sm mt-2">Explore Plans</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="p-4 bg-brand-cream rounded-xl border border-brand/10">
                    <p className="font-medium text-sm text-brand">{sub.SubscriptionPlan?.name}</p>
                    {sub.next_delivery_date && (
                      <p className="text-xs text-gray-600 mt-1">
                        Next delivery: {new Date(sub.next_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                    <span className="badge-green text-xs mt-2">ACTIVE</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="text-sm text-gray-600">Chat with our team directly on WhatsApp</p>
          </div>
          <button
            onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold flex-shrink-0"
          >
            💬 Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
