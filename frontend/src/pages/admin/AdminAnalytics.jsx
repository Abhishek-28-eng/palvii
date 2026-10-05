import { useState, useEffect } from 'react';
import { growthService } from '../../services';
import { TrendingUp, MapPin, Users, BarChart2, Zap } from 'lucide-react';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-400', APPROVED: 'bg-green-400', SCHEDULED: 'bg-blue-400',
  DELIVERED: 'bg-emerald-400', FEEDBACK_RECEIVED: 'bg-teal-400',
  CONVERTED: 'bg-brand', NOT_CONVERTED: 'bg-gray-300', REJECTED: 'bg-red-300',
};

const STATUS_LABELS = {
  PENDING: 'Pending', APPROVED: 'Approved', SCHEDULED: 'Scheduled',
  DELIVERED: 'Delivered', FEEDBACK_RECEIVED: 'Feedback', CONVERTED: 'Subscribed',
  NOT_CONVERTED: 'Not Converted', REJECTED: 'Rejected',
};

function FunnelBar({ status, count, max }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{STATUS_LABELS[status]}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${STATUS_COLORS[status] || 'bg-gray-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    growthService.getAnalytics()
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card p-8 animate-pulse h-64" />;
  if (!data)   return <p className="text-gray-400">Failed to load analytics.</p>;

  const totalTrials = data.trial_funnel.reduce((s, t) => s + t.count, 0);
  const maxFunnel   = data.trial_funnel[0]?.count || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <BarChart2 className="text-brand" size={22} />
        <h1 className="text-2xl font-bold text-gray-900 font-display">Growth Analytics</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Trials',       value: totalTrials,                  icon: <Users size={18} className="text-blue-500" />,    bg: 'bg-blue-50' },
          { label: 'Trial → Subscriber', value: `${data.conversion_rate}%`,  icon: <TrendingUp size={18} className="text-green-600" />, bg: 'bg-green-50' },
          { label: 'Active Subscribers', value: data.active_subscriptions,    icon: <Zap size={18} className="text-purple-500" />,     bg: 'bg-purple-50' },
          { label: 'Waitlisted',         value: data.waitlist_demand.reduce((s, w) => s + parseInt(w.count), 0), icon: <MapPin size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
        ].map((kpi, i) => (
          <div key={i} className="card p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>{kpi.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{kpi.label}</p>
              <p className="text-xl font-bold text-gray-900 font-display">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Funnel */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-5 font-display flex items-center gap-2">
            <TrendingUp size={16} className="text-brand" /> Trial Funnel
          </h2>
          <div className="space-y-3">
            {data.trial_funnel.map(t => (
              <FunnelBar key={t.status} status={t.status} count={t.count} max={maxFunnel} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Conversion rate</span>
            <span className="font-bold text-brand text-lg">{data.conversion_rate}%</span>
          </div>
        </div>

        {/* Top Areas by Trial Volume */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-5 font-display flex items-center gap-2">
            <MapPin size={16} className="text-brand" /> Top Areas — Trial Demand
          </h2>
          {data.top_areas.length === 0 ? (
            <p className="text-gray-400 text-sm">No area data yet</p>
          ) : (
            <div className="space-y-3">
              {data.top_areas.map((a, i) => {
                const max = parseInt(data.top_areas[0].count);
                const pct = Math.round((parseInt(a.count) / max) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-600 w-28 truncate shrink-0">{a.area || '—'}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-6 text-right">{a.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Waitlist Demand Heatmap */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-1 font-display flex items-center gap-2">
            <MapPin size={16} className="text-orange-500" /> Waitlist — Expansion Demand
          </h2>
          <p className="text-xs text-gray-400 mb-4">Areas where people signed up but you're not serving yet</p>
          {data.waitlist_demand.length === 0 ? (
            <p className="text-gray-400 text-sm">No waitlist data yet</p>
          ) : (
            <div className="space-y-2">
              {data.waitlist_demand.map((w, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 rounded-full w-6 h-6 flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{w.area}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{w.count} waiting</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Family Size Distribution */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-1 font-display flex items-center gap-2">
            <Users size={16} className="text-blue-500" /> Family Size Distribution
          </h2>
          <p className="text-xs text-gray-400 mb-4">Helps plan which basket sizes to launch next</p>
          {data.family_size_distribution.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet</p>
          ) : (
            <div className="space-y-3">
              {data.family_size_distribution.map((f, i) => {
                const max = parseInt(data.family_size_distribution[0].count);
                const pct = Math.round((parseInt(f.count) / max) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-28 shrink-0">{f.family_size}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-700 w-8 text-right">{f.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
