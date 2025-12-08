import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ImageSlideshow } from '../components/ImageSlideshow';
import { colors } from '../config/theme.config';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid or missing reset token.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      navigate('/login', { state: { message: 'Password reset successfully. Please login with your new password.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
              Reset Password
            </h2>
            <p style={{ color: colors.textMuted }}>
              Enter your new password below.
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

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  borderColor: colors.border,
                  color: colors.textPrimary
                }}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
                style={{ color: colors.textPrimary }}
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading || !token}
              style={{
                backgroundColor: colors.primary
              }}
              onMouseEnter={(e) => {
                if (!loading && token) {
                  e.currentTarget.style.backgroundColor = colors.primaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && token) {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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
