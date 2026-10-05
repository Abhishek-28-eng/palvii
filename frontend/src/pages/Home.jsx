import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, CheckCircle, Package, Truck, Star, MessageCircle, ChevronDown, Sprout, Sun, ShoppingBasket } from 'lucide-react';
import { openWhatsApp, whatsAppMessages } from '../utils/whatsapp';
import { trialService } from '../services';
import toast from 'react-hot-toast';

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative bg-brand-cream overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-light" />
      </div>

      <div className="page-container py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white border border-brand/20 rounded-full px-4 py-1.5 mb-6">
              <Leaf size={14} className="text-brand" />
              <span className="text-sm font-medium text-brand">Our Farm to Your Home</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-display mb-6">
              Fresh From <span className="text-brand">Our Farm.</span>
              <br />
              Straight to Your <span className="text-brand-earth">Home.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Fresh vegetables carefully selected, sorted, packed and delivered to your doorstep — directly from our farms and partner farmers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/baskets" className="btn-primary text-base py-3.5 px-8">
                <Sprout size={20} />
                Try Your First Basket
              </Link>
              <Link to="/vegetables" className="btn-secondary text-base py-3.5 px-8">
                Explore Vegetables
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-brand" />
                Farm-fresh quality
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-brand" />
                Home delivered
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-brand" />
                First basket free
              </div>
            </div>
          </div>

          {/* Happy Customer Photo */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src="/happy-customer.jpg"
                alt="Happy family receiving fresh Palvii vegetable basket at home"
                className="w-full h-full object-cover rounded-3xl"
                style={{ aspectRatio: '3/2' }}
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl"></span>
                    <p className="text-sm font-semibold text-brand">Free trial for first families</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-green-50 border border-green-200 rounded-full px-3 py-1">Limited slots</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Value Cards ──────────────────────────────────────────────────────────────
const valueCards = [
  {
    img: '/icon-farm.jpg',
    title: 'Direct From Farms',
    desc: 'Vegetables sourced from our farms and selected partner farmers.',
  },
  {
    img: '/icon-quality.jpg',
    title: 'Carefully Selected',
    desc: 'Every vegetable is sorted and quality checked before packing.',
  },
  {
    img: '/icon-packing.jpg',
    title: 'Carefully Packed',
    desc: 'Each type of vegetable is packed according to its nature to help protect freshness.',
  },
  {
    img: '/icon-delivery.jpg',
    title: 'Home Delivered',
    desc: 'Your Palvii basket reaches your doorstep on the scheduled delivery day.',
  },
];

function ValueSection() {
  return (
    <section className="py-20 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Why Choose Palvii?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            We take every step seriously — from farm to your kitchen.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueCards.map((card, i) => (
            <div key={i} className="card-hover p-6 text-center group flex flex-col items-center">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-display">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  { img: '/icon-farm.jpg', label: 'Farm', desc: 'Grown at our farms and partner farms' },
  { img: '/icon-harvest.jpg', label: 'Harvest & Source', desc: 'Carefully harvested or sourced' },
  { img: '/icon-quality.jpg', label: 'Sort & Check', desc: 'Quality check for every vegetable' },
  { img: '/icon-packing.jpg', label: 'Pack', desc: 'Vegetable-specific careful packing' },
  { img: '/icon-delivery.jpg', label: 'Deliver', desc: 'Fresh to your doorstep' },
];

function HowItWorksSection() {
  return (
    <section className="py-20 bg-brand-section">
      <div className="page-container">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">From Our Farm to Your Home</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Every step is done with care, so what reaches you is truly fresh.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-brand/20 mx-16" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-card overflow-hidden mb-4 relative z-10 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200">
                  <img src={step.img} alt={step.label} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand text-white rounded-full text-xs font-bold flex items-center justify-center z-20">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1 font-display">{step.label}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/how-it-works" className="btn-outline">
            Learn More About Our Process <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Trial Basket ─────────────────────────────────────────────────────────────
function TrialSection() {
  const [form, setForm] = useState({
    name: '', mobile: '', whatsapp: '', address: '',
    area: '', society: '', family_size: '', preferred_delivery_day: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'mobile' && !form.whatsapp) {
      setForm(prev => ({ ...prev, whatsapp: value }));
    }
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
      toast.success('Trial request submitted! We\'ll contact you on WhatsApp.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white" id="trial">
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
              <Star size={14} className="text-brand" />
              <span className="text-sm font-medium text-brand">Limited Pilot Slots</span>
            </div>
            <h2 className="section-title mb-4">Try Palvii Once. Completely Free.</h2>
            <p className="section-subtitle max-w-lg mx-auto">
              We're starting our journey with a small group of families. Get your first Palvii vegetable basket completely free and tell us what you think.
            </p>
          </div>

          {submitted ? (
            <div className="card p-10 text-center animate-slide-up">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Request Received!</h3>
              <p className="text-gray-600 mb-6">
                Thank you! We'll review your request and contact you on WhatsApp to schedule your free Palvii basket.
              </p>
              <button
                onClick={() => openWhatsApp(whatsAppMessages.trialRequest())}
                className="btn-primary"
              >
                <MessageCircle size={18} />
                Also Message Us on WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className="input" />
                </div>
                <div>
                  <label className="label">Mobile Number *</label>
                  <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" required className="input" type="tel" />
                </div>
                <div>
                  <label className="label">WhatsApp Number</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="If different from mobile" className="input" type="tel" />
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
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Your full address" required className="input h-24 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Area / Locality</label>
                  <input name="area" value={form.area} onChange={handleChange} placeholder="e.g. Baner" className="input" />
                </div>
                <div>
                  <label className="label">Society / Apartment</label>
                  <input name="society" value={form.society} onChange={handleChange} placeholder="e.g. Greenview Apartments" className="input" />
                </div>
              </div>

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

              <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                📝 Your request will be reviewed by our team. We'll contact you on WhatsApp to confirm availability and schedule delivery. This is a pilot programme for a limited number of families.
              </p>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                {loading ? 'Submitting...' : '🌿 Request Free Trial'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── WhatsApp CTA ─────────────────────────────────────────────────────────────
function WhatsAppCTA() {
  return (
    <section className="py-16 bg-green-600">
      <div className="page-container text-center">
        <div className="text-4xl mb-4">💬</div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
          Prefer Ordering on WhatsApp?
        </h2>
        <p className="text-green-100 mb-8 text-lg max-w-xl mx-auto">
          You can also place your order directly on WhatsApp. We're just a message away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => openWhatsApp(whatsAppMessages.orderBasket())}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all"
          >
            <MessageCircle size={20} />
            Order on WhatsApp
          </button>
          <button
            onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-all border border-white/20"
          >
            Chat with Palvii
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Farm Story ───────────────────────────────────────────────────────────────
function FarmStorySection() {
  return (
    <section className="py-20 bg-brand-section">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-brand/20 rounded-full px-4 py-1.5 mb-6">
              <Sprout size={14} className="text-brand" />
              <span className="text-sm font-medium text-brand">Our Story</span>
            </div>
            <h2 className="section-title mb-6">Where Your Vegetables Begin</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our journey starts at the farm. We grow vegetables ourselves and work with selected farmers to bring fresh produce to families.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every vegetable that reaches you has been carefully handled — from the soil to our sorting facility, and then directly to your home. No unnecessary stops in between.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We believe families deserve to know where their food comes from. That's the Palvii promise.
            </p>
            <Link to="/about" className="btn-primary">
              Our Story <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { img: '/icon-farm.jpg', label: 'Our Farm' },
              { img: '/icon-harvest.jpg', label: 'Partner Farmers' },
              { img: '/icon-quality.jpg', label: 'Fresh Produce' },
              { img: '/icon-delivery.jpg', label: 'Your Home' },
            ].map((item, i) => (
              <div key={i} className="card overflow-hidden text-center hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
                <img src={item.img} alt={item.label} className="w-full h-32 object-cover" />
                <p className="text-sm font-semibold text-gray-700 py-3 px-4">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">What Our First Families Say</h2>
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
            <Star size={14} className="text-yellow-500" />
            <span className="text-sm text-yellow-700">Reviews will appear here once our pilot families share their experience</span>
          </div>
        </div>
        <div className="card p-10 text-center max-w-xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={28} className="text-yellow-400 fill-yellow-400" />)}</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-display">Be Among the First</h3>
          <p className="text-gray-600 mb-6">
            We're just getting started. Try our free trial basket and be one of the first families to share your experience.
          </p>
          <Link to="/trial" className="btn-primary">
            <Sprout size={18} />
            Request Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValueSection />
      <HowItWorksSection />
      <TrialSection />
      <FarmStorySection />
      <WhatsAppCTA />
      <ReviewsSection />
    </>
  );
}
