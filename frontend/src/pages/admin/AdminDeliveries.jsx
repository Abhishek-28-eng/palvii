import { useState, useEffect } from 'react';
import { deliveryService } from '../../services';
import toast from 'react-hot-toast';
import { X, MapPin, Phone } from 'lucide-react';

const STATUS_OPTIONS = ['SCHEDULED', 'ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'];
const STATUS_COLORS = { SCHEDULED: 'badge-yellow', ASSIGNED: 'badge-blue', OUT_FOR_DELIVERY: 'badge-blue', DELIVERED: 'badge-green', FAILED: 'badge-red', CANCELLED: 'badge-red' };

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const load = () => {
    setLoading(true);
    deliveryService.getAll({ date: filterDate || undefined, area: filterArea || undefined, limit: 100 })
      .then(r => setDeliveries(r.data.data))
      .catch(() => toast.error('Failed to load deliveries'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterDate, filterArea]);

  // Group by society
  const grouped = deliveries.reduce((acc, d) => {
    const key = d.society || d.area || 'Others';
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  const handleUpdate = async () => {
    try {
      await deliveryService.update(selected.id, { status: newStatus });
      toast.success('Delivery status updated');
      setSelected(null);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display flex-1">Deliveries</h1>
        <input type="date" className="input w-44 text-sm" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <input placeholder="Filter by area" className="input w-44 text-sm" value={filterArea} onChange={e => setFilterArea(e.target.value)} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand">{deliveries.length}</p>
          <p className="text-sm text-gray-500">Total Deliveries</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{deliveries.filter(d => d.status === 'SCHEDULED').length}</p>
          <p className="text-sm text-gray-500">Scheduled</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{deliveries.filter(d => d.status === 'DELIVERED').length}</p>
          <p className="text-sm text-gray-500">Delivered</p>
        </div>
      </div>

      {/* Update modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold font-display">Update Delivery</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <p className="font-medium">{selected.Order?.User?.name}</p>
                <p className="text-gray-500">{selected.Order?.delivery_address?.address_line1}</p>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpdate} className="btn-primary flex-1">Update</button>
                <button onClick={() => setSelected(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-8 animate-pulse h-64" />
      ) : Object.keys(grouped).length === 0 ? (
        <div className="card p-14 text-center">
          <p className="text-gray-400">No deliveries found for selected filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([society, items]) => (
            <div key={society} className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand" />
                  <h3 className="font-semibold text-gray-900">{society}</h3>
                </div>
                <span className="badge-green">{items.length} deliveries</span>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map(d => (
                  <div key={d.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{d.Order?.User?.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={11} /> {d.Order?.User?.mobile}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{d.Order?.delivery_address?.address_line1}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand">₹{d.Order?.total}</span>
                      <span className={`badge text-xs ${STATUS_COLORS[d.status] || 'badge-yellow'}`}>{d.status}</span>
                      <button onClick={() => { setSelected(d); setNewStatus(d.status); }} className="btn-outline text-xs py-1.5 px-3">Update</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
