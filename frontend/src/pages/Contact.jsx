import { Mail, Phone, MessageCircle } from 'lucide-react';
import { openWhatsApp, whatsAppMessages } from '../utils/whatsapp';

export default function ContactPage() {
  return (
    <div className="py-10">
      <div className="bg-brand-section py-12 mb-12">
        <div className="page-container">
          <h1 className="section-title mb-3">Contact Us</h1>
          <p className="section-subtitle">We're here to help. Reach out anytime.</p>
        </div>
      </div>

      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Get in Touch</h2>
            <div className="space-y-5">
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageCircle size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500 mb-2">Fastest way to reach us</p>
                  <button onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())} className="btn-primary text-sm py-2 px-5">
                    Chat on WhatsApp
                  </button>
                </div>
              </div>

              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Phone size={22} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <a href="tel:+918767724022" className="text-brand hover:text-brand-light text-sm font-medium">+91 8767724022</a>
                </div>
              </div>

              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Mail size={22} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:hello@palvii.in" className="text-brand hover:text-brand-light text-sm font-medium">hello@palvii.in</a>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Frequently Asked</h2>
            <div className="space-y-5">
              {[
                ['How do I place an order?', 'You can order on WhatsApp or through our website once you have an account.'],
                ['What areas do you deliver to?', 'We are currently in pilot mode. Contact us to check if we deliver to your area.'],
                ['How do I get a free trial?', 'Fill in the trial request form on our homepage and we\'ll get in touch.'],
                ['Can I pause my subscription?', 'Yes, you can pause or cancel your subscription anytime from your account.'],
              ].map(([q, a], i) => (
                <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                  <p className="font-semibold text-gray-900 mb-1.5 text-sm">{q}</p>
                  <p className="text-sm text-gray-600">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
