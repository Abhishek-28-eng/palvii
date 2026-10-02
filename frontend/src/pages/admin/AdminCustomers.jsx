import { useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    adminService.getCustomers({ search: search || undefined, page, limit: 20 })
      .then(r => { setCustomers(r.data.data); setPagination(r.data.pagination); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, page]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Customers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input className="input pl-9 w-64 text-sm" placeholder="Search by name or mobile..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Name</th>
                <th className="text-left p-4 font-semibold text-gray-600">Mobile</th>
                <th className="text-left p-4 font-semibold text-gray-600">Email</th>
                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                <th className="text-left p-4 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center"><div className="animate-pulse h-8 bg-gray-100 rounded" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No customers found</td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.mobile}</td>
                  <td className="p-4 text-gray-500">{c.email || '—'}</td>
                  <td className="p-4"><span className={c.is_active ? 'badge-green' : 'badge-red'}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(pagination.pages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm ${page === i + 1 ? 'bg-brand text-white' : 'bg-gray-100 hover:bg-brand-cream'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
