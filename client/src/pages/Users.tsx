import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { colors } from '../config/theme.config';

export function Users() {
  return (
    <DashboardLayout>
      <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
        <CardHeader>
          <CardTitle style={{ color: colors.textPrimary }}>User Management</CardTitle>
          <CardDescription style={{ color: colors.textMuted }}>
            Manage users and their permissions here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p style={{ color: colors.textMuted }}>
            This is a placeholder page. Implement your user management functionality here.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
