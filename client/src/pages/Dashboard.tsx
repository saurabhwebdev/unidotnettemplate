import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center group cursor-default">
          <h1
            className="text-4xl font-semibold mb-3 transition-opacity duration-500 group-hover:opacity-70"
            style={{ color: colors.textPrimary }}
          >
            Coming Soon
          </h1>
          <div className="flex items-center justify-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover:scale-125"
              style={{ backgroundColor: colors.primary }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-500 group-hover:scale-125"
              style={{ backgroundColor: colors.primary, opacity: 0.6 }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-700 group-hover:scale-125"
              style={{ backgroundColor: colors.primary, opacity: 0.3 }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
