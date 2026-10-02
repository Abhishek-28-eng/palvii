import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      toast.error('Please enter your mobile/email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(form);
      login(res.data.data.user, res.data.data.token);
      toast.success(`Welcome back, ${res.data.data.user.name}!`);
      if (res.data.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.png" alt="Palvii" className="h-12 w-auto"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
            />
            <span className="text-3xl font-bold text-brand font-display hidden">PALVII</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Our Farm to Your Home</p>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your Palvii account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Mobile Number or Email</label>
              <input
                type="text"
                className="input"
                placeholder="9876543210 or email@example.com"
                value={form.identifier}
                onChange={(e) => setForm(p => ({ ...p, identifier: e.target.value }))}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand font-semibold hover:text-brand-light">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/" className="hover:text-brand">← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
