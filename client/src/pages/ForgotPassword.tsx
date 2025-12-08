import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageSlideshow } from '../components/ImageSlideshow';
import { colors } from '../config/theme.config';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
              Forgot Password?
            </h2>
            <p style={{ color: colors.textMuted }}>
              Enter your email address and we'll send you a link to reset your password.
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

            {success && (
              <div
                className="text-sm p-3 rounded-md"
                style={{
                  backgroundColor: '#d1fae5',
                  color: '#065f46'
                }}
              >
                Password reset link has been sent to your email. Please check your inbox.
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <p className="text-sm text-center" style={{ color: colors.textMuted }}>
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: colors.primary }}
              >
                Back to login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
