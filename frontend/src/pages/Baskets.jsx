import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sprout, Clock } from 'lucide-react';

const VEGGIES = [
  { name: 'Tomato',   emoji: '🍅', detail: 'Vine-ripened' },
  { name: 'Potato',   emoji: '🥔', detail: 'Farm-fresh' },
  { name: 'Onion',    emoji: '🧅', detail: 'Red & white' },
  { name: 'Spinach',  emoji: '🥬', detail: 'Tender leaves' },
  { name: 'Capsicum', emoji: '🫑', detail: 'Crisp & sweet' },
  { name: 'Carrot',   emoji: '🥕', detail: 'Naturally sweet' },
  { name: 'Cucumber', emoji: '🥒', detail: 'Cool & fresh' },
];

function FreeTrialCard() {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-card-hover border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(45,106,79,0.15)] hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row min-h-[480px]">
        <div className="relative lg:w-[45%] overflow-hidden bg-brand-cream">
          <img
            src="/basket-trial.jpg"
            alt="Palvii free trial basket with 7 fresh vegetables"
            className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
          <div className="absolute top-5 left-5">
            <span className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-green tracking-wide">
              🎁 FREE TRIAL
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 lg:hidden">
            <p className="text-white font-bold text-xl font-display drop-shadow-lg">Palvii Starter Basket</p>
            <p className="text-white/80 text-sm mt-0.5">7 farm-fresh vegetables · First basket free</p>
          </div>
        </div>

        <div className="lg:w-[55%] flex flex-col p-7 lg:p-9">
          <div className="mb-6">
            <div className="hidden lg:flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest text-brand uppercase">Available Now</span>
              <div className="flex-1 h-px bg-brand/20" />
            </div>
            <h2 className="hidden lg:block text-3xl font-bold text-gray-900 font-display mb-2">
              Palvii Starter Basket
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your first Palvii basket — completely free. 7 handpicked, farm-fresh vegetables delivered to your door. No card required. No subscription.
            </p>
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
              What's inside
            </p>
            <div className="space-y-2.5">
              {VEGGIES.map((v) => (
                <div key={v.name} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center flex-shrink-0">{v.emoji}</span>
                  <div className="flex-1 flex items-center justify-between border-b border-dashed border-gray-100 pb-2.5">
                    <span className="text-sm font-semibold text-gray-800">{v.name}</span>
                    <span className="text-xs text-gray-400 italic">{v.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-4xl font-bold text-brand font-display">FREE</p>
              <p className="text-xs text-gray-400 mt-0.5">One-time · First basket only</p>
            </div>
            <Link
              to="/trial"
              className="inline-flex items-center gap-2.5 bg-brand hover:bg-brand-dark text-white font-semibold px-7 py-3.5 rounded-2xl transition-all duration-200 shadow-green hover:shadow-[0_6px_24px_rgba(45,106,79,0.4)] group/btn text-sm"
            >
              <Sprout size={16} className="group-hover/btn:rotate-12 transition-transform duration-200" />
              Request Free Trial
              <ArrowRight size={15} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ image, name, teaser, alt }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-white shadow-card border border-gray-100 group">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover scale-105 blur-[1.5px] brightness-[0.55] group-hover:brightness-[0.45] transition-all duration-500"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg">
            <Lock size={20} className="text-white" />
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-5 py-2">
            <Clock size={12} className="text-white/90" />
            <span className="text-white text-xs font-bold tracking-wide">Coming Soon</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-gray-300 font-display">{name}</h3>
          <span className="flex-shrink-0 text-xs font-semibold text-gray-300 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
            {String.fromCharCode(0x20B9)} {String.fromCharCode(0xB7, 0xB7, 0xB7)}
          </span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{teaser}</p>
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-300 text-sm font-semibold cursor-not-allowed select-none"
        >
          <Lock size={13} />
          Not Available Yet
        </button>
      </div>
    </div>
  );
}

export default function BasketsPage() {
  const comingSoon = [
    {
      image: '/basket-premium.jpg',
      name: 'Palvii Premium Basket',
      teaser: 'A curated selection of premium and exotic vegetables for adventurous cooks and larger families.',
      alt: 'Premium vegetable basket coming soon',
    },
    {
      image: '/basket-seasonal.jpg',
      name: 'Palvii Seasonal Basket',
      teaser: "Crafted every week around what's freshest from our farms and trusted partner growers.",
      alt: 'Seasonal vegetable basket coming soon',
    },
  ];

  return (
    <div>
      <div
        className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #f0f7f3 60%, #e8f5ee 100%)' }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-leaf/10 translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="page-container relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-brand/15 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <Sprout size={13} className="text-brand" />
            <span className="text-xs font-semibold text-brand tracking-wide">Farm Fresh · Home Delivered</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-display mb-4 leading-tight">
            Our <span className="text-brand">Baskets</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Start your Palvii journey with a free trial. More handcrafted basket options are arriving soon.
          </p>
        </div>
      </div>

      <div className="page-container py-12 md:py-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-brand bg-green-50 border border-green-200/70 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Available Now
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        <div className="mb-16">
          <FreeTrialCard />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 bg-gray-50 border border-gray-200 px-4 py-1.5 rounded-full">
            <Clock size={11} />
            Coming Soon
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {comingSoon.map((b) => (
            <ComingSoonCard key={b.name} {...b} />
          ))}
        </div>

        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-3">Zero Risk · No Payment Required</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-3">
            Try Palvii Before You Decide
          </h3>
          <p className="text-green-100/80 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Your first basket of 7 farm-fresh vegetables is completely free. Just share your address and we'll handle the rest.
          </p>
          <Link
            to="/trial"
            className="inline-flex items-center gap-2.5 bg-white text-brand font-bold px-8 py-3.5 rounded-2xl hover:bg-brand-cream transition-all duration-200 shadow-lg text-sm group/cta"
          >
            <Sprout size={17} className="group-hover/cta:rotate-12 transition-transform duration-200" />
            Request Your Free Basket
            <ArrowRight size={15} className="group-hover/cta:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}
