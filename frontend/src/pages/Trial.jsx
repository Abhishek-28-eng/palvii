import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CheckCircle2, MessageCircle, Star, ArrowLeft, ShieldCheck, Truck, AlertCircle, RefreshCw, ArrowRight, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { trialService, growthService } from '../services';
import { openWhatsApp, whatsAppMessages } from '../utils/whatsapp';

const VEGGIES = [
  { name: 'Tomato',   detail: 'Vine-ripened' },
  { name: 'Potato',   detail: 'Farm-fresh' },
  { name: 'Onion',    detail: 'Red & white' },
  { name: 'Spinach',  detail: 'Tender leaves' },
  { name: 'Capsicum', detail: 'Crisp & sweet' },
  { name: 'Carrot',   detail: 'Naturally sweet' },
  { name: 'Cucumber', detail: 'Cool & fresh' },
];

// Status configs for the duplicate-trial wall
const DUPLICATE_STATUS_CONFIG = {
  PENDING:           { badge: 'In Review',  badgeColor: 'bg-green-100 text-green-700',  cta: 'pending'   },
  APPROVED:          { badge: 'Approved',   badgeColor: 'bg-emerald-100 text-emerald-700', cta: 'approved' },
  SCHEDULED:         { badge: 'Scheduled',  badgeColor: 'bg-blue-100 text-blue-700',    cta: 'approved'  },
  DELIVERED:         { badge: 'Delivered',  badgeColor: 'bg-orange-100 text-orange-700', cta: 'subscribe' },
  FEEDBACK_RECEIVED: { badge: 'Completed',  badgeColor: 'bg-green-100 text-green-700',  cta: 'subscribe' },
  CONVERTED:         { badge: 'Subscribed', badgeColor: 'bg-brand/10 text-brand',        cta: 'dashboard' },
  NOT_CONVERTED:     { badge: 'Trial Used', badgeColor: 'bg-amber-100 text-amber-700',  cta: 'subscribe' },
  REJECTED:          { badge: 'Unavailable',badgeColor: 'bg-gray-100 text-gray-500',    cta: 'contact'   },
};

function DuplicateBlock({ trialStatus, serverMessage }) {
  const cfg = DUPLICATE_STATUS_CONFIG[trialStatus] || DUPLICATE_STATUS_CONFIG['PENDING'];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden text-center">

        {/* Top green stripe */}
        <div className="h-1 bg-gradient-to-r from-brand to-brand-leaf" />

        <div className="px-8 pt-10 pb-8">
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
  
  // Blinkit-style flow states
  const [step, setStep] = useState('CHECK'); // CHECK | TRIAL | WAITLIST | SUCCESS | WAITLIST_SUCCESS
  const [checkingService, setCheckingService] = useState(false);
  const [serviceCheck, setServiceCheck] = useState({ area: '', pincode: '' });

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    address: '',
    area: '',
    pincode: '',
    society: '',
    family_size: '',
    preferred_delivery_day: '',
    preferred_slot: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'mobile' && !form.whatsapp) {
      setForm((prev) => ({ ...prev, whatsapp: value }));
    }
  };

  const handleServiceCheckChange = (e) => {
    const { name, value } = e.target;
    setServiceCheck(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckServiceability = async (e) => {
    e.preventDefault();
    if (!serviceCheck.area && !serviceCheck.pincode) {
      toast.error('Please enter an area or pincode');
      return;
    }
    setCheckingService(true);
    try {
      const res = await growthService.checkServiceability(serviceCheck);
      if (res.data.serviceable) {
        toast.success(`Great news! We deliver to ${res.data.area || serviceCheck.area || serviceCheck.pincode}.`);
        setForm(prev => ({ 
          ...prev, 
          area: res.data.area || serviceCheck.area, 
          pincode: serviceCheck.pincode 
        }));
        setStep('TRIAL');
      } else {
        setStep('WAITLIST');
      }
    } catch (err) {
      toast.error('Failed to check serviceability');
    } finally {
      setCheckingService(false);
    }
  };

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !serviceCheck.area) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        mobile: form.mobile,
        area: serviceCheck.area,
        pincode: serviceCheck.pincode,
        society: form.society
      };
      const res = await growthService.joinWaitlist(payload);
      toast.success(res.data.message);
      setStep('WAITLIST_SUCCESS');
    } catch (err) {
      toast.error('Failed to join waitlist');
    } finally {
      setLoading(false);
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
      setStep('SUCCESS');
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
                  FREE TRIAL
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
                      {v.name}
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
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 relative min-h-[500px]">
            {step === 'SUCCESS' && (
              <div className="py-10 text-center animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                  Request Received
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                  Your request has been submitted. Our team will connect with you via WhatsApp to verify your locality and confirm delivery.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => openWhatsApp(whatsAppMessages.trialRequest(form))} className="btn-primary">
                    <MessageCircle size={18} /> Confirm on WhatsApp
                  </button>
                  <Link to="/baskets" className="btn-secondary">View Other Baskets</Link>
                </div>
              </div>
            )}

            {step === 'WAITLIST_SUCCESS' && (
              <div className="py-10 text-center animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display">
                  Added to Waitlist
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                  We're expanding quickly. We'll send you a WhatsApp message the moment Palvii starts delivering fresh farm produce to {serviceCheck.area || serviceCheck.pincode}.
                </p>
                <Link to="/" className="btn-primary inline-flex">Return to Home</Link>
              </div>
            )}

            {step === 'CHECK' && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-2">
                    <MapPin size={13} className="text-brand" />
                    <span className="text-xs font-semibold text-brand">Serviceability Check</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">
                    Delivery Location
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Check if we deliver to your area.
                  </p>
                </div>

                <form onSubmit={handleCheckServiceability} className="space-y-5">
                  <div>
                    <label className="label">Your Area / Locality *</label>
                    <input
                      name="area"
                      value={serviceCheck.area}
                      onChange={handleServiceCheckChange}
                      placeholder="e.g. Baner, Wakad, Kothrud"
                      required
                      className="input py-3 text-lg"
                    />
                  </div>
                  <div>
                    <label className="label">Pincode (Optional)</label>
                    <input
                      name="pincode"
                      value={serviceCheck.pincode}
                      onChange={handleServiceCheckChange}
                      placeholder="e.g. 411045"
                      className="input py-3 text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={checkingService}
                    className="btn-primary w-full py-4 text-base font-semibold shadow-green mt-4"
                  >
                    {checkingService ? 'Checking...' : 'Check Availability'}
                  </button>
                </form>
              </div>
            )}

            {step === 'WAITLIST' && (
              <div className="animate-slide-left">
                <button onClick={() => setStep('CHECK')} className="text-gray-400 hover:text-gray-600 mb-4 inline-block">← Back</button>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mb-2">
                    <AlertCircle size={13} className="text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600">Coming Soon</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">
                    Oops! We're not in {serviceCheck.area || serviceCheck.pincode} yet.
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    But we're expanding fast! Join the waitlist and be the first to know (and get your free basket) when we arrive in your neighborhood.
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="input" />
                  </div>
                  <div>
                    <label className="label">WhatsApp Number *</label>
                    <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" required type="tel" className="input" />
                  </div>
                  <div>
                    <label className="label">Society / Building (Optional)</label>
                    <input name="society" value={form.society} onChange={handleChange} placeholder="e.g. Greenview Apts" className="input" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base font-semibold shadow-green mt-2">
                    {loading ? 'Joining...' : 'Join the Waitlist'}
                  </button>
                </form>
              </div>
            )}

            {step === 'TRIAL' && (
              <div className="animate-slide-left">
                <button onClick={() => setStep('CHECK')} className="text-gray-400 hover:text-gray-600 mb-4 inline-block">← Change Area</button>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 mb-2">
                    <Star size={13} className="text-brand" />
                    <span className="text-xs font-semibold text-brand">First Order Free</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 font-display">
                    Complete Request
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Delivering to <span className="font-semibold text-gray-700">{form.area}</span>. Fill in the rest to claim your free basket!
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required className="input" />
                    </div>
                    <div>
                      <label className="label">Mobile Number *</label>
                      <input name="mobile" value={form.mobile} onChange={handleChange} onBlur={handleMobileBlur} placeholder="10-digit mobile" required type="tel" className="input" />
                      {checkingMobile && <span className="text-xs text-brand mt-1 flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Checking...</span>}
                    </div>
                    <div>
                      <label className="label">WhatsApp Number</label>
                      <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="If different from mobile" type="tel" className="input" />
                    </div>
                    <div>
                      <label className="label">Family Size</label>
                      <select name="family_size" value={form.family_size} onChange={handleChange} className="select">
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
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Flat/House number, building, street address" required className="input h-20 resize-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Area / Locality *</label>
                      <input name="area" value={form.area} onChange={handleChange} required className="input bg-gray-50" readOnly />
                    </div>
                    <div>
                      <label className="label">Society / Building Name</label>
                      <input name="society" value={form.society} onChange={handleChange} placeholder="e.g. Greenview Apts" className="input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Preferred Delivery Day</label>
                      <select name="preferred_delivery_day" value={form.preferred_delivery_day} onChange={handleChange} className="select">
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
                    <div>
                      <label className="label">Preferred Time Slot</label>
                      <select name="preferred_slot" value={form.preferred_slot || ''} onChange={handleChange} className="select">
                        <option value="">Any time</option>
                        <option value="Morning (7 AM - 10 AM)">Morning (7 AM - 10 AM)</option>
                        <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                        <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base font-semibold shadow-green mt-2">
                    {loading ? 'Submitting...' : 'Submit Request'}
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
