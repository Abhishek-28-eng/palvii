import { useState, useEffect } from 'react';
import { adminService, orderService, trialService, subscriptionService } from '../../services';
import { Users, ShoppingBasket, Calendar, Truck, Package, FileText, TrendingUp, AlertCircle } from 'lucide-react';

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {loading ? (
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 font-display">{value ?? '—'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingTrials, setPendingTrials] = useState([]);

  useEffect(() => {
    Promise.all([
      adminService.getDashboard(),
      orderService.getAll({ limit: 5, page: 1 }),
      trialService.getAll({ status: 'PENDING', limit: 5 }),
    ]).then(([statsRes, ordersRes, trialsRes]) => {
      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data);
      setPendingTrials(trialsRes.data.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { icon: <Users size={22} className="text-blue-600" />, label: 'Total Customers', value: stats?.totalCustomers, color: 'bg-blue-50' },
    { icon: <FileText size={22} className="text-orange-600" />, label: 'Trial Requests', value: stats?.trialRequests, color: 'bg-orange-50' },
    { icon: <Calendar size={22} className="text-purple-600" />, label: 'Active Subscriptions', value: stats?.activeSubscriptions, color: 'bg-purple-50' },
    { icon: <ShoppingBasket size={22} className="text-brand" />, label: "Today's Orders", value: stats?.todaysOrders, color: 'bg-green-50' },
    { icon: <AlertCircle size={22} className="text-yellow-600" />, label: 'Pending Orders', value: stats?.pendingOrders, color: 'bg-yellow-50' },
    { icon: <Truck size={22} className="text-indigo-600" />, label: "Today's Deliveries", value: stats?.todaysDeliveries, color: 'bg-indigo-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to Palvii Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} loading={loading} />
        ))}
      </div>

      {/* Revenue */}
      {stats && (
        <div className="card p-6 mb-8 bg-brand text-white">
          <div className="flex items-center gap-3">
            <TrendingUp size={24} />
            <div>
              <p className="text-green-200 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold font-display">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4 font-display">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{order.User?.name} · ₹{order.total}</p>
                  </div>
                  <span className={`badge text-xs ${
                    order.status === 'DELIVERED' ? 'badge-green' :
                    order.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'
                  }`}>{order.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Trial Requests */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4 font-display">Pending Trial Requests</h2>
          {pendingTrials.length === 0 ? (
            <p className="text-gray-400 text-sm">No pending trials</p>
          ) : (
            <div className="space-y-3">
              {pendingTrials.map(trial => (
                <div key={trial.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{trial.name}</p>
                    <p className="text-xs text-gray-500">{trial.mobile} · {trial.area}</p>
                  </div>
                  <span className="badge-yellow text-xs">PENDING</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
