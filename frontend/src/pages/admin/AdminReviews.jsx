import { useState, useEffect } from 'react';
import { reviewService } from '../../services';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    reviewService.getAll()
      .then(r => setReviews(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, is_approved, is_featured = false) => {
    try {
      await reviewService.approve(id, { is_approved, is_featured });
      toast.success(is_approved ? 'Review approved' : 'Review hidden');
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const stars = (n) => [...Array(5)].map((_, i) => (
    <Star key={i} size={12} className={i < n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
  ));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 font-display mb-6">Reviews</h1>

      {loading ? <div className="card p-8 h-64 animate-pulse" /> : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="card p-14 text-center text-gray-400">No reviews yet</div>
          ) : reviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{r.User?.name}</p>
                    <div className="flex">{stars(r.overall_rating)}</div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 mb-2">"{r.comment}"</p>}
                  <div className="flex gap-3 text-xs text-gray-400">
                    {r.quality_rating && <span>Quality: {r.quality_rating}⭐</span>}
                    {r.packing_rating && <span>Packing: {r.packing_rating}⭐</span>}
                    {r.delivery_rating && <span>Delivery: {r.delivery_rating}⭐</span>}
                    {r.continue_preference && <span>Continue: {r.continue_preference}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <span className={r.is_approved ? 'badge-green' : 'badge-yellow'}>{r.is_approved ? 'Approved' : 'Pending'}</span>
                    {r.is_featured && <span className="badge bg-purple-100 text-purple-700">Featured</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(r.id, !r.is_approved)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${r.is_approved ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {r.is_approved ? 'Hide' : 'Approve'}
                    </button>
                    {r.is_approved && (
                      <button onClick={() => handleApprove(r.id, true, !r.is_featured)} className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 font-medium transition-all">
                        {r.is_featured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
