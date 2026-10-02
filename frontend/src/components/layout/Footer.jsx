import { Link } from 'react-router-dom';
import { Share2, Globe, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { openWhatsApp, whatsAppMessages } from '../../utils/whatsapp';

const footerLinks = {
  quick: [
    { to: '/', label: 'Home' },
    { to: '/vegetables', label: 'Our Vegetables' },
    { to: '/baskets', label: 'Baskets' },
    { to: '/subscriptions', label: 'Subscriptions' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ],
  customer: [
    { to: '/dashboard', label: 'My Account' },
    { to: '/my-orders', label: 'My Orders' },
    { to: '/my-subscriptions', label: 'My Subscriptions' },
    { to: '/trial', label: 'Free Trial' },
  ],
  legal: [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/refund-policy', label: 'Refund / Cancellation Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Palvii" className="h-10 w-auto brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
              />
              <span className="text-2xl font-bold text-white font-display hidden">PALVII</span>
            </Link>
            <p className="text-green-300 text-sm font-medium mb-3">Our Farm to Your Home.</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Fresh vegetables carefully selected from our farms and partner farmers, sorted, packed and delivered to your doorstep.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-leaf text-white transition-all">
                <Share2 size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-brand-leaf text-white transition-all">
                <Globe size={18} />
              </a>
              <button onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-green-500 text-white transition-all">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 font-display">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerLinks.quick.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-green-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-semibold text-white mb-5 font-display">Customer</h4>
            <ul className="space-y-2.5">
              {footerLinks.customer.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-green-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold text-white mb-5 mt-8 font-display">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-green-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 font-display">Contact Us</h4>
            <div className="space-y-4">
              <button
                onClick={() => openWhatsApp(whatsAppMessages.generalEnquiry())}
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={16} className="text-green-400 flex-shrink-0" />
                Chat on WhatsApp
              </button>
              <a href="tel:+919999999999" className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-300 transition-colors">
                <Phone size={16} className="text-green-400 flex-shrink-0" />
                +91 8767724022
              </a>
              <a href="mailto:hello@palvii.in" className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-300 transition-colors">
                <Mail size={16} className="text-green-400 flex-shrink-0" />
                hello@palvii.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Palvii. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Made with ❤️ for fresh vegetable lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
