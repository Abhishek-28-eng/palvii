import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, CheckCircle, Truck, Star, MessageCircle, Sprout, MapPin, Shield, ChevronRight } from 'lucide-react';
import { openWhatsApp, whatsAppMessages } from '../utils/whatsapp';

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden hero-gradient" style={{ minHeight: '92vh' }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #52B788 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #74C69D 0%, transparent 70%)' }} />
      </div>

      <div className="page-container relative z-10 flex flex-col justify-center" style={{ minHeight: '92vh', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-in">
            {/* Eyebrow pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-sm font-medium">Now delivering in Pune</span>
            </div>

            <h1 className="hero-title text-white mb-6">
              Farm fresh.<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #52B788, #74C69D)' }}>
                Delivered fast.
              </span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg">
              Fresh vegetables sourced from local farms. Sorted, packed, and delivered straight to your door.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link to="/trial" className="btn-white text-base py-4 px-8">
                Start Free Trial
              </Link>
              <Link to="/baskets" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/25 text-white font-semibold text-base rounded-xl hover:bg-white/20 active:scale-[0.97] backdrop-blur-sm transition-all duration-200">
                View Plans
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {[
                { icon: <Shield size={14} />, text: 'No credit card needed' },
                { icon: <CheckCircle size={14} />, text: 'Farm-fresh quality' },
                { icon: <Truck size={14} />, text: 'Direct doorstep delivery' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-green-300 text-sm font-medium">
                  {item.icon} {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — stacked cards */}
          <div className="relative hidden lg:block animate-fade-in">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
              <img
                src="/basket-trial.jpg"
                alt="Palvii fresh vegetable basket"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-8 bg-white rounded-2xl px-5 py-4 shadow-card-hover animate-slide-up">
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>100%</p>
              <p className="text-xs text-gray-500 font-medium">Farm-to-Home Delivery</p>
            </div>

            {/* Floating veggie badge */}
            <div className="absolute -top-4 -right-4 bg-brand rounded-2xl p-4 shadow-green">
              <p className="text-white text-sm font-semibold">7 Veggies Weekly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 60 900 0 720 20C540 40 240 0 0 20L0 60Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}

// ─── CATEGORY TILES ────────────────────────────────────────────────────────────
const categories = [
  { name: 'Tomatoes',   color: 'bg-red-50',    border: 'border-red-100' },
  { name: 'Leafy Greens', color: 'bg-green-50', border: 'border-green-100' },
  { name: 'Root Veggies', color: 'bg-orange-50', border: 'border-orange-100' },
  { name: 'Onion & Garlic', color: 'bg-purple-50', border: 'border-purple-100' },
  { name: 'Capsicum',   color: 'bg-yellow-50', border: 'border-yellow-100' },
  { name: 'Cucumbers',  color: 'bg-lime-50',   border: 'border-lime-100' },
];

function CategoryStrip() {
  return (
    <section className="py-10 bg-white border-b border-gray-100">
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            What's in season
          </h2>
          <Link to="/vegetables" className="text-sm font-semibold text-brand flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={i}
              to="/vegetables"
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${cat.color} ${cat.border} hover:scale-105 hover:shadow-card transition-all duration-200 cursor-pointer`}
            >
              <span className="text-sm font-semibold text-gray-700 text-center leading-tight py-2">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHY PALVII ────────────────────────────────────────────────────────────────
const valueProps = [
  {
    icon: <Leaf size={22} className="text-brand" />,
    bg: 'bg-green-50',
    title: 'Sourced Locally',
    desc: 'Working directly with partner farmers in your region.',
  },
  {
    icon: <Star size={22} className="text-amber-500" />,
    bg: 'bg-amber-50',
    title: 'Quality Sorted',
    desc: 'Every vegetable is checked and sorted before packing.',
  },
  {
    icon: <Truck size={22} className="text-blue-500" />,
    bg: 'bg-blue-50',
    title: 'Home Delivered',
    desc: 'Fresh to your doorstep on your scheduled delivery day.',
  },
  {
    icon: <Shield size={22} className="text-purple-500" />,
    bg: 'bg-purple-50',
    title: 'No Hidden Fees',
    desc: 'Pay for what you get. Cancel your subscription anytime.',
  },
];

function WhySection() {
  return (
    <section className="py-20 bg-white">
      <div className="page-container">
        <div className="text-center mb-12">
          <h2 className="section-title mt-4 mb-4">Why Palvii</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {valueProps.map((v, i) => (
            <div key={i} className="card-hover p-6 group">
              <div className={`w-12 h-12 rounded-2xl ${v.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {v.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-[15px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FREE TRIAL BANNER ─────────────────────────────────────────────────────────
function TrialBanner() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 mb-3">
                <span className="text-xs font-bold text-green-200 uppercase tracking-wider">Limited Slots</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.03em' }}>
                First basket free.
              </h2>
              <p className="text-green-100 text-base max-w-md">
                7 fresh vegetables delivered to your door. No card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/trial" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-dark font-bold rounded-xl hover:bg-green-50 active:scale-[0.97] transition-all shadow-lg text-base whitespace-nowrap">
                Start Trial
              </Link>
              <Link to="/baskets" className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-base whitespace-nowrap">
                See Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────
const steps = [
  { num: '01', title: 'Check Coverage', desc: 'Enter your pincode to confirm delivery.' },
  { num: '02', title: 'Request Trial', desc: 'Provide details in under 2 minutes.' },
  { num: '03', title: 'Schedule', desc: 'We verify and schedule your delivery.' },
  { num: '04', title: 'Receive', desc: 'Get your basket delivered fresh.' },
];

function HowItWorksSection() {
  return (
    <section className="py-20 section-bg">
      <div className="page-container">
        <div className="text-center mb-14">
          <h2 className="section-title mt-4 mb-4">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-brand/20 z-0" />
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <span className="text-xs font-black text-brand/40 tracking-widest mb-2">{step.num}</span>
              <h4 className="font-bold text-gray-900 mb-2 text-[15px]" style={{ fontFamily: 'Poppins, sans-serif' }}>{step.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WHATSAPP CTA ──────────────────────────────────────────────────────────────
function WhatsAppCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="page-container">
        <div className="bg-[#25D366]/8 border border-[#25D366]/20 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
              Order via WhatsApp
            </h3>
            <p className="text-gray-500 text-base max-w-md">
              Drop us a message for quick ordering or queries.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => openWhatsApp(whatsAppMessages.orderBasket())}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20ba5a] active:scale-[0.97] transition-all shadow-lg text-base"
            >
              <MessageCircle size={19} />
              Order on WhatsApp
            </button>
            <button
              onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.97] transition-all text-base"
            >
              General Enquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <WhySection />
      <TrialBanner />
      <HowItWorksSection />
      <WhatsAppCTA />
    </>
  );
}
