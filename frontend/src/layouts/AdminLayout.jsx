import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBasket, ClipboardList,
  Users, Truck, Star, Settings, Menu, X, Leaf, LogOut,
  CalendarDays, FileText
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', exact: true },
  { to: '/admin/orders', icon: <ShoppingBasket size={18} />, label: 'Orders' },
  { to: '/admin/trial-requests', icon: <FileText size={18} />, label: 'Trial Requests' },
  { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/admin/categories', icon: <Leaf size={18} />, label: 'Categories' },
  { to: '/admin/baskets', icon: <ShoppingBasket size={18} />, label: 'Baskets' },
  { to: '/admin/subscriptions', icon: <CalendarDays size={18} />, label: 'Subscriptions' },
  { to: '/admin/deliveries', icon: <Truck size={18} />, label: 'Deliveries' },
  { to: '/admin/customers', icon: <Users size={18} />, label: 'Customers' },
  { to: '/admin/reviews', icon: <Star size={18} />, label: 'Reviews' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Palvii" className="h-8 w-auto brightness-0 invert"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span className="text-white font-bold font-display text-lg hidden">PALVII</span>
        </Link>
        <p className="text-green-300 text-xs mt-1 pl-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.to, item.exact)
                ? 'bg-white/20 text-white'
                : 'text-green-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-green-200 hover:text-white transition-colors px-4 py-2 w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-brand-dark flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-brand-dark flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-gray-900 text-lg font-display">
            {navItems.find(i => isActive(i.to, i.exact))?.label || 'Admin'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/" className="text-sm text-brand hover:text-brand-light">View Site</Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
