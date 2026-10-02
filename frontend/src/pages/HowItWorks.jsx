import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    img: '/icon-farm.jpg', step: 1, title: 'Farm',
    desc: 'Vegetables are grown at our own farms or sourced from selected partner farmers we trust.',
    detail: 'We maintain direct relationships with our farms. No random middlemen choosing produce on our behalf.',
  },
  {
    img: '/icon-harvest.jpg', step: 2, title: 'Harvest & Source',
    desc: 'Vegetables are harvested at the right time or collected from partner farms with care.',
    detail: 'Timing matters. We work with farmers to ensure vegetables are collected at their freshest.',
  },
  {
    img: '/icon-quality.jpg', step: 3, title: 'Sort & Quality Check',
    desc: 'Every batch is sorted and checked. Vegetables that don\'t meet our standards are not packed.',
    detail: 'This step ensures that what leaves us is something we\'re proud to deliver.',
  },
  {
    img: '/icon-packing.jpg', step: 4, title: 'Vegetable-Specific Packing',
    desc: 'Each type of vegetable is packed according to its nature to help maintain freshness during transit.',
    detail: 'Leafy greens, root vegetables, and soft vegetables all need different handling.',
  },
  {
    img: '/icon-delivery.jpg', step: 5, title: 'Home Delivery',
    desc: 'Your Palvii basket is delivered to your doorstep on the scheduled delivery day.',
    detail: 'We aim to make the delivery experience convenient and reliable.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="py-10">
      <div className="bg-brand-section py-14 mb-12">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h1 className="section-title mb-4">How It Works</h1>
          <p className="section-subtitle">
            From the soil of our farm to your family's kitchen — here's every step we take.
          </p>
        </div>
      </div>

      <div className="page-container max-w-3xl">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand/20 hidden md:block" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={step.step} className="flex gap-6 relative">
                {/* Step circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-card overflow-hidden border-2 border-brand/10">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                </div>

                <div className="flex-1 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{step.title}</h3>
                  <p className="text-gray-700 mb-2 leading-relaxed">{step.desc}</p>
                  <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-3">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 bg-brand rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-bold mb-3 font-display">Experience it yourself</h3>
          <p className="text-green-200 mb-6">Try your first Palvii basket completely free.</p>
          <Link to="/trial" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand font-semibold rounded-xl hover:bg-green-50 transition-all">
            Request Free Trial <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
