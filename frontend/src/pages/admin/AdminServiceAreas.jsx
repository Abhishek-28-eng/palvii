import { useState, useEffect } from 'react';
import { growthService } from '../../services';
import toast from 'react-hot-toast';
import { Plus, Trash2, ToggleLeft, ToggleRight, MapPin, Send, ChevronDown, ChevronUp } from 'lucide-react';

export default function AdminServiceAreas() {
  const [areas, setAreas]         = useState([]);
  const [waitlist, setWaitlist]   = useState([]);
  const [byArea, setByArea]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ area: '', pincode: '', notes: '' });
  const [adding, setAdding]       = useState(false);
  const [expanded, setExpanded]   = useState(null);
  const [notifying, setNotifying] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      growthService.getServiceAreas(),
      growthService.getWaitlist({ notified: 'false' }),
    ]).then(([areasRes, wlRes]) => {
      setAreas(areasRes.data.data);
      setWaitlist(wlRes.data.data);
      setByArea(wlRes.data.by_area || []);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.area) return toast.error('Area name is required');
    try {
      await growthService.addServiceArea(form);
      toast.success(`${form.area} added as serviceable area`);
      setForm({ area: '', pincode: '', notes: '' });
      setAdding(false);
      load();
    } catch { toast.error('Failed to add area'); }
  };

  const toggleActive = async (sa) => {
    try {
      await growthService.updateServiceArea(sa.id, { is_active: !sa.is_active });
      toast.success(sa.is_active ? 'Area paused' : 'Area activated');
      load();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service area?')) return;
    try {
      await growthService.deleteServiceArea(id);
      toast.success('Deleted');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const handleNotify = async (area) => {
    setNotifying(area);
    try {
      const r = await growthService.notifyWaitlistArea(area);
      toast.success(r.data.message);
      load();
    } catch { toast.error('Failed to send notifications'); }
    finally { setNotifying(null); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-2">
            <MapPin size={22} className="text-brand" /> Service Areas
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage where Palvii delivers. Waitlist shows expansion demand.</p>
        </div>
        <button onClick={() => setAdding(v => !v)} className="btn-primary flex items-center gap-2 text-sm py-2.5">
          <Plus size={16} /> Add Area
        </button>
      </div>

      {/* Add Area Form */}
      {adding && (
        <form onSubmit={handleAdd} className="card p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="label">Area Name *</label>
            <input className="input" placeholder="e.g. Baner, Kothrud" value={form.area}
              onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input className="input" placeholder="411045" value={form.pincode}
              onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1 text-sm">Save</button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm px-3">✕</button>
          </div>
        </form>
      )}

      {/* Active Service Areas */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700">Serviceable Areas ({areas.length})</p>
        </div>
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl" />)}
          </div>
        ) : areas.length === 0 ? (
          <p className="p-6 text-sm text-gray-400 text-center">No areas added yet. Add your first delivery area above.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {areas.map(sa => (
              <div key={sa.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${sa.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{sa.area}</p>
                    {sa.pincode && <p className="text-xs text-gray-400">{sa.pincode}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sa.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sa.is_active ? 'Active' : 'Paused'}
                  </span>
                  <button onClick={() => toggleActive(sa)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title={sa.is_active ? 'Pause' : 'Activate'}>
                    {sa.is_active
                      ? <ToggleRight size={20} className="text-green-500" />
                      : <ToggleLeft size={20} className="text-gray-400" />}
                  </button>
                  <button onClick={() => handleDelete(sa.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Waitlist Demand */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900 font-display">Waitlist — Expansion Demand</h2>
          <span className="text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">{waitlist.length} people</span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          These people want Palvii in areas you don't serve yet. When you're ready to launch, hit "Notify" to send them a WhatsApp.
        </p>

        {byArea.length === 0 ? (
          <div className="card p-8 text-center text-sm text-gray-400">No waitlist entries yet</div>
        ) : (
          <div className="space-y-3">
            {byArea.map(group => (
              <div key={group.area} className="card overflow-hidden">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(expanded === group.area ? null : group.area)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold text-lg">{group.count}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{group.area}</p>
                      <p className="text-xs text-gray-400">people waiting</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); handleNotify(group.area); }}
                      disabled={notifying === group.area}
                      className="flex items-center gap-1.5 text-xs bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
                    >
                      <Send size={12} />
                      {notifying === group.area ? 'Sending...' : 'Notify on WhatsApp'}
                    </button>
                    {expanded === group.area ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>
                {expanded === group.area && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {group.entries.map(e => (
                      <div key={e.id} className="flex items-center justify-between px-4 py-2.5">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{e.name}</p>
                          {e.society && <p className="text-xs text-gray-400">{e.society}</p>}
                        </div>
                        <p className="text-xs text-gray-400">{e.mobile}</p>
                      </div>
                    ))}
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
