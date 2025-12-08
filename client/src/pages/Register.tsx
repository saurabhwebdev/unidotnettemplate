import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MicrosoftLoginButton } from '../components/MicrosoftLoginButton';
import { ImageSlideshow } from '../components/ImageSlideshow';
import { colors } from '../config/theme.config';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              Create Account
            </h2>
            <p style={{ color: colors.textMuted }}>
              Enter your information to get started
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    borderColor: colors.border,
                    color: colors.textPrimary
                  }}
                />
              </div>
            </div>

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
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-white"
              disabled={loading}
              style={{
                backgroundColor: colors.primary
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
              {loading ? 'Creating account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
