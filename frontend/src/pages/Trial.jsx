import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CheckCircle2, MessageCircle, Star, ArrowLeft, ShieldCheck, Truck, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { trialService } from '../services';
import { openWhatsApp, whatsAppMessages } from '../utils/whatsapp';

const VEGGIES = [
  { name: 'Tomato',   emoji: '🍅', detail: 'Vine-ripened' },
  { name: 'Potato',   emoji: '🥔', detail: 'Farm-fresh' },
  { name: 'Onion',    emoji: '🧅', detail: 'Red & white' },
  { name: 'Spinach',  emoji: '🥬', detail: 'Tender leaves' },
  { name: 'Capsicum', emoji: '🫑', detail: 'Crisp & sweet' },
  { name: 'Carrot',   emoji: '🥕', detail: 'Naturally sweet' },
  { name: 'Cucumber', emoji: '🥒', detail: 'Cool & fresh' },
];

// Status configs for the duplicate-trial wall
const DUPLICATE_STATUS_CONFIG = {
  PENDING:           { icon: '🌿', badge: 'In Review',  badgeColor: 'bg-green-100 text-green-700',  cta: 'pending'   },
  APPROVED:          { icon: '🎉', badge: 'Approved',   badgeColor: 'bg-emerald-100 text-emerald-700', cta: 'approved' },
  SCHEDULED:         { icon: '📦', badge: 'Scheduled',  badgeColor: 'bg-blue-100 text-blue-700',    cta: 'approved'  },
  DELIVERED:         { icon: '🥕', badge: 'Delivered',  badgeColor: 'bg-orange-100 text-orange-700', cta: 'subscribe' },
  FEEDBACK_RECEIVED: { icon: '💚', badge: 'Completed',  badgeColor: 'bg-green-100 text-green-700',  cta: 'subscribe' },
  CONVERTED:         { icon: '🌱', badge: 'Subscribed', badgeColor: 'bg-brand/10 text-brand',        cta: 'dashboard' },
  NOT_CONVERTED:     { icon: '🛒', badge: 'Trial Used', badgeColor: 'bg-amber-100 text-amber-700',  cta: 'subscribe' },
  REJECTED:          { icon: '🙏', badge: 'Unavailable',badgeColor: 'bg-gray-100 text-gray-500',    cta: 'contact'   },
};

function DuplicateBlock({ trialStatus, serverMessage }) {
  const cfg = DUPLICATE_STATUS_CONFIG[trialStatus] || DUPLICATE_STATUS_CONFIG['PENDING'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden text-center">

        {/* Top green stripe */}
        <div className="h-1 bg-gradient-to-r from-brand to-brand-leaf" />

        <div className="px-8 pt-10 pb-8">
          {/* Emoji */}
          <div className="text-6xl mb-4">{cfg.icon}</div>

          {/* Status badge */}
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${cfg.badgeColor}`}>
            {cfg.badge}
          </span>

          {/* Short message */}
          <p className="text-gray-700 text-sm leading-relaxed mb-7">{serverMessage}</p>

          {/* Primary CTA */}
          <div className="space-y-2.5">
            {cfg.cta === 'subscribe' && (
              <Link to="/subscriptions" className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-sm">
                <Sprout size={15} /> Subscribe Now <ArrowRight size={14} />
              </Link>
            )}
            {cfg.cta === 'dashboard' && (
              <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-sm">
                <ArrowRight size={14} /> My Dashboard
              </Link>
            )}
            {cfg.cta === 'contact' && (
              <button
                onClick={() => openWhatsApp('Hi Palvii! My free trial request could not be fulfilled. Can you help? 🙏')}
                className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-sm"
              >
                <MessageCircle size={15} /> WhatsApp Us
              </button>
            )}
            {(cfg.cta === 'pending' || cfg.cta === 'approved') && (
              <button
                onClick={() => openWhatsApp(whatsAppMessages.trialRequest())}
                className="flex items-center justify-center gap-2 w-full btn-primary py-3 text-sm"
              >
                <MessageCircle size={15} /> Follow Up on WhatsApp
              </button>
            )}
            <Link to="/" className="flex items-center justify-center w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrialPage() {
  const [duplicate, setDuplicate] = useState(null);
  const [checkingMobile, setCheckingMobile] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    address: '',
    area: '',
    society: '',
    family_size: '',
    preferred_delivery_day: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'mobile' && !form.whatsapp) {
      setForm((prev) => ({ ...prev, whatsapp: value }));
    }
  };

  // Pre-check on mobile blur — saves user from filling the whole form
  const handleMobileBlur = async () => {
    const mobile = form.mobile.trim();
    if (mobile.length < 10) return;
    setCheckingMobile(true);
    try {
      const res = await trialService.checkByMobile(mobile);
      if (res.data.exists) {
        // Trigger the same duplicate UI immediately
        const statusMsgs = {
          PENDING:           `Hi! Your request is already with us. We'll WhatsApp you soon.`,
          APPROVED:          `Your free basket is already approved! Check WhatsApp for delivery details.`,
          SCHEDULED:         `Delivery is already scheduled! Check your WhatsApp for the date.`,
          DELIVERED:         `You've already had your free basket. Subscribe to keep it coming!`,
          FEEDBACK_RECEIVED: `Your free trial is done. Ready for a weekly plan?`,
          CONVERTED:         `You're already a Palvii subscriber!`,
          NOT_CONVERTED:     `Your free trial is used. Subscribe anytime!`,
          REJECTED:          `We couldn't reach your area yet. WhatsApp us and we'll help!`,
        };
        setDuplicate({
          status: res.data.status,
          message: statusMsgs[res.data.status] || `You've already submitted a request. We'll be in touch!`,
        });
      }
    } catch { /* silent — user can still submit */ }
    finally { setCheckingMobile(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.address) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await trialService.submit(form);
      setSubmitted(true);
      toast.success("Trial request submitted! We'll contact you on WhatsApp.");
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 409 && data?.code === 'DUPLICATE_TRIAL') {
        setDuplicate({ status: data.status, message: data.message });
      } else {
        toast.error(data?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If duplicate detected, replace the whole page
  if (duplicate) {
    return <DuplicateBlock trialStatus={duplicate.status} serverMessage={duplicate.message} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 md:py-16">
      <div className="page-container max-w-5xl">
        <Link
          to="/baskets"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Baskets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left summary column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
              <img
                src="/basket-trial.jpg"
                alt="Palvii Starter Basket"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-green">
                  🎁 FREE TRIAL
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                Palvii Starter Basket
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your first basket is 100% free. Experience the taste and crunch of truly fresh farm produce.
              </p>
            </div>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                7 Fresh Vegetables Included:
              </p>
              <div className="space-y-2">
                {VEGGIES.map((v) => (
                  <div key={v.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-gray-800">
                      <span>{v.emoji}</span> {v.name}
                    </span>
                    <span className="text-xs text-gray-400 italic">{v.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand shrink-0" />
                <span>Zero payment or card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-brand shrink-0" />
                <span>Delivered directly to your society doorstep</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand shrink-0" />
                <span>No commitment or subscription lock-in</span>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100">
            {submitted ? (
              <div className="py-10 text-center animate-slide-up">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                  Free Basket Requested!
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you! We have received your request. Our team will verify your locality and connect with you on WhatsApp to confirm delivery time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => openWhatsApp(whatsAppMessages.trialRequest())}
                    className="btn-primary"
                  >
                    <MessageCircle size={18} />
                    Confirm on WhatsApp
                  </button>
                  <Link to="/baskets" className="btn-secondary">
                    View Other Baskets
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-2">
                    <Star size={13} className="text-brand" />
                    <span className="text-xs font-semibold text-brand">First Order Free</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">
                    Where should we deliver your basket?
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Fill in your details below to claim your free trial basket.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile"
                        required
                        type="tel"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">WhatsApp Number</label>
                      <input
                        name="whatsapp"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="If different from mobile"
                        type="tel"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Family Size</label>
                      <select
                        name="family_size"
                        value={form.family_size}
                        onChange={handleChange}
                        className="select"
                      >
                        <option value="">Select size</option>
                        <option value="1-2">1-2 people</option>
                        <option value="3-4">3-4 people</option>
                        <option value="5-6">5-6 people</option>
                        <option value="7+">7+ people</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Delivery Address *</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Flat/House number, building, street address"
                      required
                      className="input h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Area / Locality</label>
                      <input
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        placeholder="e.g. Baner, Wakad, Kothrud"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Society / Building Name</label>
                      <input
                        name="society"
                        value={form.society}
                        onChange={handleChange}
                        placeholder="e.g. Greenview Apts"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Preferred Delivery Day</label>
                    <select
                      name="preferred_delivery_day"
                      value={form.preferred_delivery_day}
                      onChange={handleChange}
                      className="select"
                    >
                      <option value="">Any day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-base font-semibold shadow-green mt-2"
                  >
                    <Sprout size={18} />
                    {loading ? 'Submitting...' : 'Claim My Free Basket'}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    🔒 No credit card required. Free trial is limited to 1 per household.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
