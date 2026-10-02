import { useState, useEffect } from 'react';
import { trialService } from '../../services';
import toast from 'react-hot-toast';
import { X, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { openWhatsApp } from '../../utils/whatsapp';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'SCHEDULED', 'DELIVERED', 'FEEDBACK_RECEIVED', 'CONVERTED', 'NOT_CONVERTED', 'REJECTED'];
const STATUS_COLORS = {
  PENDING: 'badge-yellow', APPROVED: 'badge-green', SCHEDULED: 'badge-blue',
  DELIVERED: 'badge-green', FEEDBACK_RECEIVED: 'badge-blue',
  CONVERTED: 'badge bg-purple-100 text-purple-700', NOT_CONVERTED: 'badge-red', REJECTED: 'badge-red',
};

export default function AdminTrialRequests() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', admin_notes: '', scheduled_date: '' });

  const load = () => {
    setLoading(true);
    trialService.getAll({ status: filter || undefined, limit: 50 })
      .then(r => setTrials(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const openUpdate = (trial) => {
    setSelected(trial);
    setForm({ status: trial.status, admin_notes: trial.admin_notes || '', scheduled_date: trial.scheduled_date || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await trialService.updateStatus(selected.id, form);
      toast.success('Status updated');
      setSelected(null);
      load();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Trial Requests</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="select w-44 text-sm">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Update modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg font-display">Update Trial Request</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm">
                <p className="font-semibold text-gray-900">{selected.name}</p>
                <p className="text-gray-600">{selected.mobile} · {selected.area} · {selected.society}</p>
                <p className="text-gray-600 mt-1">{selected.address}</p>
                {selected.family_size && <p className="text-gray-500 text-xs mt-1">Family: {selected.family_size}</p>}
                {selected.preferred_delivery_day && <p className="text-gray-500 text-xs">Prefers: {selected.preferred_delivery_day}</p>}
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="label">Status</label>
                  <select className="select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {form.status === 'SCHEDULED' && (
                  <div>
                    <label className="label">Scheduled Date</label>
                    <input type="date" className="input" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} />
                  </div>
                )}
                <div>
                  <label className="label">Admin Notes</label>
                  <textarea className="input h-20 resize-none" value={form.admin_notes} onChange={e => setForm(f => ({ ...f, admin_notes: e.target.value }))} placeholder="Internal notes..." />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary flex-1">Save</button>
                  <button
                    type="button"
                    onClick={() => openWhatsApp(`Hi ${selected.name}! We received your Palvii free trial request. We'd like to schedule your delivery. Is ${selected.preferred_delivery_day || 'this week'} convenient for you?`)}
                    className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-all"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </button>
                </div>
              </form>
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
                  <th className="text-left p-4 font-semibold text-gray-600">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Area / Society</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Family</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Prefers</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {trials.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">No trial requests found</td></tr>
                ) : trials.map(t => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.mobile}</p>
                    </td>
                    <td className="p-4 text-gray-600">{t.area}{t.society ? ` · ${t.society}` : ''}</td>
                    <td className="p-4 text-gray-600">{t.family_size || '—'}</td>
                    <td className="p-4 text-gray-600">{t.preferred_delivery_day || '—'}</td>
                    <td className="p-4"><span className={`badge text-xs ${STATUS_COLORS[t.status] || 'badge-yellow'}`}>{t.status}</span></td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="p-4">
                      <button onClick={() => openUpdate(t)} className="btn-outline text-xs py-1.5 px-3">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
