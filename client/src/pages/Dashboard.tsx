import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { User } from '../services/auth.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { colors } from '../config/theme.config';

export function Dashboard() {
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6">
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
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
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.textPrimary }}>
                Welcome back, {user?.firstName}!
              </CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                Your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2" style={{ color: colors.textSecondary }}>
              <div>
                <span className="font-medium" style={{ color: colors.textPrimary }}>Name:</span> {user?.firstName} {user?.lastName}
              </div>
              <div>
                <span className="font-medium" style={{ color: colors.textPrimary }}>Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-medium" style={{ color: colors.textPrimary }}>User ID:</span> {user?.id}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.textPrimary }}>Getting Started</CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                This is your UniTemplate dashboard. You can start building your application here.
              </CardDescription>
            </CardHeader>
            <CardContent style={{ color: colors.textSecondary }}>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>The backend API is configured with JWT authentication</li>
                <li>Microsoft SSO integration for corporate email sign-in (configurable)</li>
                <li>SQL Server database with Entity Framework Core</li>
                <li>React frontend with Vite, TypeScript, Tailwind CSS, and shadcn/ui</li>
                <li>API-first design with automatic token refresh</li>
              </ul>
            </CardContent>
          </Card>
      </div>
    </DashboardLayout>
  );
}
