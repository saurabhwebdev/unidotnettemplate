import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MicrosoftLoginButton } from '../components/MicrosoftLoginButton';
import { ImageSlideshow } from '../components/ImageSlideshow';
import { colors } from '../config/theme.config';
import { Loader2 } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password, rememberMe });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in" style={{ backgroundColor: colors.bgSecondary }}>
      {/* Left Side - Image Slideshow */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <ImageSlideshow />
      </div>

      {/* Right Side - Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ backgroundColor: colors.bgPrimary }}
      >
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              Sign In
            </h2>
            <p style={{ color: colors.textMuted }}>
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="text-sm p-3 rounded-md"
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626'
                }}
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="text-sm p-3 rounded-md"
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46'
                }}
              >
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm"
                  style={{ color: colors.textPrimary }}
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm hover:underline"
                style={{ color: colors.primary }}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full text-white flex items-center justify-center gap-2"
              disabled={loading}
              style={{
                backgroundColor: loading ? colors.primaryHover : colors.primary,
                opacity: loading ? 0.9 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = colors.primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }
              }}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full" style={{ borderTop: `1px solid ${colors.border}` }} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span
                  className="px-2"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    color: colors.textMuted
                  }}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <MicrosoftLoginButton onError={setError} />

            <p className="text-sm text-center" style={{ color: colors.textMuted }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
