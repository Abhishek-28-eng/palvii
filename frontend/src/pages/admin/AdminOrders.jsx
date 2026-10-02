import { useState, useEffect } from 'react';
import { orderService } from '../../services';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PACKING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = {
  PENDING: 'badge-yellow', CONFIRMED: 'badge-blue', PACKING: 'badge-blue',
  READY_FOR_DELIVERY: 'badge-blue', OUT_FOR_DELIVERY: 'badge-blue',
  DELIVERED: 'badge-green', CANCELLED: 'badge-red',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    orderService.getAll({ status: filter || undefined, page, limit: 20 })
      .then(r => { setOrders(r.data.data); setPagination(r.data.pagination); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, page]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await orderService.updateStatus(selected.id, { status: newStatus, admin_notes: adminNotes });
      toast.success('Order status updated');
      setSelected(null);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select w-44 text-sm">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Update modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold font-display">Update Order {selected.order_number}</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">New Status</label>
                <select className="select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  <option value="">Select status</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Admin Notes</label>
                <textarea className="input h-20 resize-none" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes..." />
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdateStatus} className="btn-primary flex-1">Update</button>
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-8 animate-pulse h-64" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Order #</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Total</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Payment</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">No orders found</td></tr>
                ) : orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{order.order_number}</td>
                    <td className="p-4">
                      <p className="text-gray-900">{order.User?.name}</p>
                      <p className="text-xs text-gray-400">{order.User?.mobile}</p>
                    </td>
                    <td className="p-4 font-semibold text-brand">₹{order.total}</td>
                    <td className="p-4 text-gray-600">{order.payment_method}</td>
                    <td className="p-4"><span className={`badge text-xs ${STATUS_COLORS[order.status] || 'badge-yellow'}`}>{order.status}</span></td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="p-4">
                      <button onClick={() => { setSelected(order); setNewStatus(order.status); setAdminNotes(order.admin_notes || ''); }} className="btn-outline text-xs py-1.5 px-3">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm ${page === i + 1 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-600 hover:bg-brand-cream'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
