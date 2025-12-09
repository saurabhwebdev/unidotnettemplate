import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.textPrimary }}
          >
            Coming Soon
          </h1>
          <p
            className="text-lg"
            style={{ color: colors.textMuted }}
          >
            Full dashboard coming soon
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
