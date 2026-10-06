import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBasket, Menu, X, User, LogOut, Settings, Package, ChevronDown, Leaf } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navLinks = [
  { to: '/',              label: 'Home' },
  { to: '/vegetables',    label: 'Vegetables' },
  { to: '/baskets',       label: 'Baskets' },
  { to: '/how-it-works',  label: 'How It Works' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/about',         label: 'About' },
];

export default function Header() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e) => { if (!e.target.closest('#user-menu')) setDropdownOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [dropdownOpen]);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };
  
  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(to + '/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100'
        : 'bg-white/96 backdrop-blur-md border-b border-gray-100/60'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-[60px] gap-4">

          {/* ── Logo ────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="Palvii Home">
            <div className="flex items-center justify-center w-8 h-8 bg-brand rounded-lg shadow-green group-hover:scale-105 transition-transform duration-200">
              <Leaf size={17} className="text-white" />
            </div>
            <img
              src="/logo.png"
              alt="Palvii"
              className="h-7 w-auto"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.parentElement) {
                  const span = e.target.parentElement.querySelector('span');
                  if (span) span.style.display = 'block';
                }
              }}
            />
            <span className="text-xl font-black text-gray-900 hidden" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.04em' }}>
              Palvii
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive(link.to)
                    ? 'text-brand bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── Right Side ───────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* Free Trial CTA */}
            <Link
              to="/trial"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-brand border border-green-200 rounded-xl text-sm font-semibold hover:bg-brand hover:text-white hover:border-brand transition-all duration-200"
            >
              <span>Free Trial</span>
            </Link>

            {/* Cart */}
            <Link
              to="/basket"
              className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
              aria-label="View basket"
            >
              <ShoppingBasket size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] text-[10px] font-bold text-white bg-brand rounded-full shadow-green">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-all text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white text-xs font-bold">
                    {initials}
                  </div>
                  <span className="hidden sm:block max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-gray-100 py-1.5 animate-scale-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/dashboard"         onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-all">
                        <Package size={15} /> My Dashboard
                      </Link>
                      <Link to="/my-orders"         onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-all">
                        <ShoppingBasket size={15} /> My Orders
                      </Link>
                      <Link to="/my-subscriptions"  onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand transition-all">
                        <Settings size={15} /> My Subscriptions
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand font-semibold hover:bg-green-50 transition-all">
                            <Settings size={15} /> Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all w-full text-left">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link to="/login"    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand hover:bg-gray-50 rounded-xl transition-all">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 rounded-xl">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-600 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ─────────────────────────────── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-card-hover animate-slide-up">
          <div className="page-container py-4 space-y-0.5">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.to)
                    ? 'bg-green-50 text-brand font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/trial" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand bg-green-50 rounded-xl mt-2">
              Request Free Trial
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <Link to="/login"    onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-sm py-2.5">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-sm py-2.5">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}



