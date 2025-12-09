import { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';
import { LayoutDashboard, Sparkles, Zap } from 'lucide-react';

export function Dashboard() {
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="text-center relative">
          {/* Floating icon */}
          <div
            className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 cursor-pointer group"
            style={{
              backgroundColor: colors.primaryLight,
            }}
          >
            <LayoutDashboard
              size={36}
              style={{ color: colors.primary }}
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <Sparkles
              size={16}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse"
              style={{ color: colors.primary }}
            />
          </div>

          {/* Main heading with gradient effect on hover */}
          <h1
            className="text-5xl font-bold mb-3 tracking-tight transition-all duration-300 hover:tracking-wide cursor-default"
            style={{ color: colors.textPrimary }}
          >
            Coming Soon
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg mb-8 transition-all duration-300"
            style={{ color: colors.textMuted }}
          >
            We're crafting something amazing
          </p>

          {/* Interactive progress dots */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredDot(index)}
                onMouseLeave={() => setHoveredDot(null)}
                className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: hoveredDot !== null && index <= hoveredDot
                    ? colors.primary
                    : colors.border,
                  transform: hoveredDot === index ? 'scale(1.5)' : 'scale(1)',
                  boxShadow: hoveredDot !== null && index <= hoveredDot
                    ? `0 0 12px ${colors.primary}40`
                    : 'none',
                }}
              />
            ))}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Analytics', 'Insights', 'Reports'].map((feature, index) => (
              <div
                key={feature}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-default"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.textSecondary,
                  border: `1px solid ${colors.border}`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <span className="flex items-center gap-2">
                  <Zap size={14} style={{ color: colors.primary }} />
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
