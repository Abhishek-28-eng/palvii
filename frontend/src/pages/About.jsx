import { Link } from 'react-router-dom';
import { Sprout, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-10">
      {/* Hero */}
      <div className="bg-brand-section py-14 mb-12">
        <div className="page-container max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white border border-brand/20 rounded-full px-4 py-1.5 mb-6">
            <Sprout size={14} className="text-brand" />
            <span className="text-sm font-medium text-brand">Our Story</span>
          </div>
          <h1 className="section-title mb-6">About Palvii</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Palvii was started with one simple belief: families deserve fresh vegetables that come directly from the farm — without excessive handling, delays or compromise on quality.
          </p>
        </div>
      </div>

      <div className="page-container max-w-4xl">
        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-5 font-display">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We grow vegetables on our own farms and source from carefully selected partner farmers. Every vegetable is sorted, quality-checked, and packed thoughtfully before reaching your home.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our goal is not just to deliver vegetables — it's to build a relationship of trust between our farm and your family.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in honest, transparent communication. We will tell you what our produce is — not what sounds good for marketing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { img: '/icon-farm.jpg',     label: 'Our Farm' },
              { img: '/icon-harvest.jpg',  label: 'Our Farmers' },
              { img: '/icon-quality.jpg',  label: 'Fresh Produce' },
              { img: '/icon-delivery.jpg', label: 'To Your Home' },
            ].map((item, i) => (
              <div key={i} className="card overflow-hidden hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
                <img src={item.img} alt={item.label} className="w-full h-28 object-cover" />
                <p className="text-sm font-semibold text-gray-700 py-3 text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 font-display text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ['Transparency', 'We communicate honestly about our produce. No false claims.'],
              ['Quality', 'Every vegetable is sorted and checked before packing.'],
              ['Freshness', 'From farm to home with minimal delay.'],
              ['Respect for Farmers', 'We work with farmers we trust and treat fairly.'],
            ].map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-3 card p-5">
                <CheckCircle size={20} className="text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-3 font-display">Ready to try Palvii?</h3>
          <p className="text-green-200 mb-6">Start with a free trial basket — no obligation.</p>
          <Link to="/trial" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand font-semibold rounded-xl hover:bg-green-50 transition-all">
            Request Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
