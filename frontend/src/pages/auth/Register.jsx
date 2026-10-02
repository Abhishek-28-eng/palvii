import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', password: '', whatsapp: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.password) {
      toast.error('Name, mobile and password are required');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register(form);
      login(res.data.data.user, res.data.data.token);
      toast.success('Welcome to Palvii!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Join Palvii and get fresh vegetables delivered</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full Name *</label>
              <input name="name" type="text" className="input" placeholder="Your full name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Mobile Number *</label>
              <input name="mobile" type="tel" className="input" placeholder="10-digit mobile number" value={form.mobile} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Email (optional)</label>
              <input name="email" type="email" className="input" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand font-semibold hover:text-brand-light">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
