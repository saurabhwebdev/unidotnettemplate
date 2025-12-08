import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { User } from '../services/auth.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { colors } from '../config/theme.config';

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6">
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" variant="circular" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full max-w-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full max-w-md" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6">
          {/* Profile Header Card */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div
                  className="h-24 w-24 rounded-full flex items-center justify-center font-bold text-3xl text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3cca70 0%, #2a9d5a 100%)'
                  }}
                >
                  {getInitials()}
                </div>
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    {user?.email}
                  </p>
                  <div
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Active User
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.textPrimary }}>Personal Information</CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                Your account details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" style={{ color: colors.textSecondary }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: colors.textMuted }}
                  >
                    First Name
                  </label>
                  <p style={{ color: colors.textPrimary }}>{user?.firstName}</p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: colors.textMuted }}
                  >
                    Last Name
                  </label>
                  <p style={{ color: colors.textPrimary }}>{user?.lastName}</p>
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Email Address
                </label>
                <p style={{ color: colors.textPrimary }}>{user?.email}</p>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: colors.textMuted }}
                >
                  User ID
                </label>
                <p
                  className="font-mono text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.textPrimary }}>Account Status</CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                Information about your account status
              </CardDescription>
            </CardHeader>
            <CardContent style={{ color: colors.textSecondary }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Verified</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Yes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}
