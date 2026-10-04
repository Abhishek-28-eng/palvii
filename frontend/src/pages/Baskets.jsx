import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sprout, CheckCircle, Clock } from 'lucide-react';

// ─── Free Trial Basket Card ───────────────────────────────────────────────────
function FreeTrialCard() {
  const veggies = [
    { name: 'Tomato', emoji: '🍅' },
    { name: 'Potato', emoji: '🥔' },
    { name: 'Onion', emoji: '🧅' },
    { name: 'Spinach', emoji: '🥬' },
    { name: 'Capsicum', emoji: '🫑' },
    { name: 'Carrot', emoji: '🥕' },
    { name: 'Cucumber', emoji: '🥒' },
  ];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card-hover bg-white flex flex-col group transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src="/basket-trial.jpg"
          alt="Palvii Free Trial Basket with 7 fresh vegetables"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            🎁 FREE TRIAL
          </span>
          <span className="bg-white text-brand text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-brand/20">
            First basket only
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-1 font-display">Palvii Starter Basket</h3>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Your first basket — completely free. Experience farm-fresh quality delivered to your doorstep with 7 handpicked vegetables.
        </p>

        {/* Vegetables list */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Includes 7 vegetables</p>
          <div className="grid grid-cols-2 gap-2">
            {veggies.map((v) => (
              <div key={v.name} className="flex items-center gap-2 bg-brand-cream rounded-xl px-3 py-2">
                <span className="text-lg">{v.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{v.name}</span>
                <CheckCircle size={13} className="text-brand ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
          <div>
            <span className="text-3xl font-bold text-brand">FREE</span>
            <p className="text-xs text-gray-400 mt-0.5">One-time trial offer</p>
          </div>
          <Link
            to="/trial"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-dark transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Sprout size={17} />
            Request Free Trial
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Coming Soon Card ─────────────────────────────────────────────────────────
function ComingSoonCard({ image, name, description, alt }) {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card bg-white flex flex-col">
      {/* Blurred image with overlay */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover blur-[2px] scale-105 brightness-75"
        />
        <div className="absolute inset-0 bg-gray-900/40 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
            <Lock size={26} className="text-white" />
          </div>
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold px-5 py-2 rounded-full flex items-center gap-2">
            <Clock size={14} className="text-brand" />
            Coming Soon
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-400 mb-1 font-display">{name}</h3>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-300">₹ ···</span>
            <p className="text-xs text-gray-300 mt-0.5">Pricing coming soon</p>
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-400 font-semibold px-5 py-3 rounded-xl cursor-not-allowed text-sm"
          >
            <Lock size={14} />
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Baskets Page ─────────────────────────────────────────────────────────────
export default function BasketsPage() {
  const comingSoonBaskets = [
    {
      image: '/basket-premium.jpg',
      name: 'Palvii Premium Basket',
      description: 'A larger, more diverse selection of farm-fresh vegetables for bigger families and vegetable lovers.',
      alt: 'Premium vegetable basket coming soon',
    },
    {
      image: '/basket-seasonal.jpg',
      name: 'Palvii Seasonal Basket',
      description: "Seasonal vegetables curated each week — whatever's freshest from our farms and partner growers.",
      alt: 'Seasonal vegetable basket coming soon',
    },
  ];

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-brand-section py-14 mb-10">
        <div className="page-container text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-brand/20 rounded-full px-4 py-1.5 mb-5">
            <Sprout size={14} className="text-brand" />
            <span className="text-sm font-medium text-brand">Farm Fresh, Home Delivered</span>
          </div>
          <h1 className="section-title mb-4">Palvii Baskets</h1>
          <p className="section-subtitle max-w-xl mx-auto">
            Start with your free trial basket — no payment, no commitment. More basket options are on their way.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Available Now label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand bg-green-50 border border-green-200 px-4 py-1.5 rounded-full">
            ✅ Available Now
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Free Trial Card — centered */}
        <div className="max-w-2xl mx-auto mb-12">
          <FreeTrialCard />
        </div>

        {/* Coming Soon divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full flex items-center gap-2">
            <Clock size={12} />
            Coming Soon
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Coming Soon cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {comingSoonBaskets.map((b) => (
            <ComingSoonCard key={b.name} {...b} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-brand-section rounded-3xl p-8 md:p-10 text-center">
          <div className="text-4xl mb-4">🌿</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">
            Start with the Free Trial Basket
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try Palvii with zero risk. Your first basket of 7 farm-fresh vegetables is completely free — just tell us where to deliver.
          </p>
          <Link
            to="/trial"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-all duration-200 shadow-sm hover:shadow-md text-base"
          >
            <Sprout size={18} />
            Request Your Free Basket
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
