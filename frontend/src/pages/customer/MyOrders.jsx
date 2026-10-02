import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services';
import toast from 'react-hot-toast';
import { Package, ChevronRight } from 'lucide-react';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PACKING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const STATUS_LABELS = {
  PENDING: 'Order Placed',
  CONFIRMED: 'Confirmed',
  PACKING: 'Packing',
  READY_FOR_DELIVERY: 'Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const STATUS_COLORS = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-blue',
  PACKING: 'badge-blue',
  READY_FOR_DELIVERY: 'badge-blue',
  OUT_FOR_DELIVERY: 'badge-blue',
  DELIVERED: 'badge-green',
  CANCELLED: 'badge-red',
};

function OrderStatusBar({ status }) {
  if (status === 'CANCELLED') return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">Order Cancelled</div>
  );
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1 flex-shrink-0">
          <div className={`flex flex-col items-center gap-1`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentIdx ? 'bg-brand text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i <= currentIdx ? 'text-brand font-medium' : 'text-gray-400'}`}>
              {STATUS_LABELS[s]}
            </span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`h-0.5 w-6 mx-1 mt-[-12px] ${i < currentIdx ? 'bg-brand' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(r => setOrders(r.data.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-10 min-h-screen bg-gray-50">
      <div className="page-container">
        <h1 className="section-title mb-8">My Orders</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-6 animate-pulse h-40" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="card p-14 text-center">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your order history will appear here.</p>
            <Link to="/baskets" className="btn-primary">Order Your First Basket</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-900 font-display">{order.order_number}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-yellow'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{order.total}</p>
                  </div>
                </div>

                <OrderStatusBar status={order.status} />

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {order.OrderItems?.length || 0} item(s) · {order.payment_method}
                    {order.preferred_delivery_date ? ` · Delivery: ${new Date(order.preferred_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                  </p>
                  <Link to={`/my-orders/${order.id}`} className="text-sm text-brand hover:text-brand-light flex items-center gap-1">
                    Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
