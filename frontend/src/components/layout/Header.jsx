import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBasket, Menu, X, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/vegetables', label: 'Our Vegetables' },
  { to: '/baskets', label: 'Baskets' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Palvii Home">
            <img
              src="/logo.png"
              alt="Palvii"
              className="h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center gap-1">
              <span className="text-2xl font-bold text-brand font-display">PALVII</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand hover:bg-brand-cream rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/basket"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-brand-cream text-gray-700 hover:text-brand transition-all"
              aria-label="View basket"
            >
              <ShoppingBasket size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand rounded-full">
                  {itemCount > 99 ? '99+' : Math.round(itemCount)}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-cream text-gray-700 hover:text-brand transition-all text-sm font-medium"
                >
                  <User size={18} />
                  <span className="hidden sm:block max-w-24 truncate">{user?.name?.split(' ')[0]}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-2 animate-slide-up">
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand transition-all">
                      <Package size={16} /> My Dashboard
                    </Link>
                    <Link to="/my-orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand transition-all">
                      <ShoppingBasket size={16} /> My Orders
                    </Link>
                    <Link to="/my-subscriptions" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-cream hover:text-brand transition-all">
                      <Settings size={16} /> My Subscriptions
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-1" />
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand font-semibold hover:bg-brand-cream transition-all">
                          <Settings size={16} /> Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-brand hover:bg-brand-cream rounded-xl transition-all">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-brand-cream text-gray-700 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-brand hover:bg-brand-cream rounded-xl transition-all"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-sm py-2.5">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-sm py-2.5">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
