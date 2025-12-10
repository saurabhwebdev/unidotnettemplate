import { DashboardLayout } from '../components/DashboardLayout';
import { colors } from '../config/theme.config';
import {
  Server,
  Database,
  Shield,
  FileCode,
  Code2,
  Palette,
  Navigation,
  Sparkles,
  User,
  Globe,
  Zap,
  Layers,
  RefreshCw,
  Lock,
  FileText,
} from 'lucide-react';

// Stack info data
const stackInfo = {
  version: '1.0.0',
  buildDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  backend: [
    { name: '.NET', version: '8.0', icon: Server, color: '#512BD4' },
    { name: 'Entity Framework', version: '9.0', icon: Database, color: '#68217A' },
    { name: 'SQL Server', version: '2022', icon: Database, color: '#CC2927' },
    { name: 'JWT Auth', version: 'Latest', icon: Shield, color: '#10B981' },
    { name: 'Swagger', version: '3.0', icon: FileCode, color: '#85EA2D' },
  ],
  frontend: [
    { name: 'React', version: '18.3', icon: Code2, color: '#61DAFB' },
    { name: 'TypeScript', version: '5.6', icon: FileCode, color: '#3178C6' },
    { name: 'Vite', version: '7.2', icon: Zap, color: '#646CFF' },
    { name: 'Tailwind CSS', version: '4.0', icon: Palette, color: '#06B6D4' },
    { name: 'React Router', version: '7.0', icon: Navigation, color: '#CA4245' },
  ],
  tools: [
    { name: 'Lucide Icons', version: '0.460', icon: Sparkles, color: '#F56565' },
    { name: 'Boring Avatars', version: '1.11', icon: User, color: '#8B5CF6' },
    { name: 'Axios', version: '1.7', icon: Globe, color: '#5A29E4' },
  ],
  features: [
    { name: 'Clean Architecture', description: 'Separation of concerns with API, Core, and Data layers', icon: Layers, color: colors.primary },
    { name: 'RESTful API', description: 'Standard REST endpoints with JWT authentication', icon: RefreshCw, color: '#3B82F6' },
    { name: 'Role-Based Access', description: 'Granular permissions with role management', icon: Lock, color: '#10B981' },
    { name: 'Audit Logging', description: 'Complete activity tracking and audit trails', icon: FileText, color: '#F56565' },
  ],
};

export default function Version() {
  return (
    <DashboardLayout>
      {/* Header Section */}
      <div
        className="pb-6 mb-6"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              UniTemplate
            </h1>
            <p className="text-base" style={{ color: colors.textMuted }}>
              Universal .NET + React Template
            </p>
          </div>
          <div className="text-right">
            <div
              className="inline-block px-3 py-1 text-xs font-medium mb-1"
              style={{
                backgroundColor: colors.bgSecondary,
                color: colors.primary,
                border: `1px solid ${colors.border}`
              }}
            >
              v{stackInfo.version}
            </div>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {stackInfo.buildDate}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Backend Stack */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <Server size={18} style={{ color: colors.textPrimary }} />
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textPrimary }}>
              Backend
            </h2>
          </div>
          <div className="space-y-3">
            {stackInfo.backend.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 px-3"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} style={{ color: item.color }} />
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    v{item.version}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Frontend Stack */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <Palette size={18} style={{ color: colors.textPrimary }} />
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textPrimary }}>
              Frontend
            </h2>
          </div>
          <div className="space-y-3">
            {stackInfo.frontend.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 px-3"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} style={{ color: item.color }} />
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    v{item.version}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools & Libraries */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <Sparkles size={18} style={{ color: colors.textPrimary }} />
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textPrimary }}>
              Tools
            </h2>
          </div>
          <div className="space-y-3">
            {stackInfo.tools.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 px-3"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} style={{ color: item.color }} />
                    <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs" style={{ color: colors.textMuted }}>
                    v{item.version}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
          <Layers size={18} style={{ color: colors.textPrimary }} />
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textPrimary }}>
            Architecture & Features
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stackInfo.features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.name}
                className="p-4"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} style={{ color: feature.color }} />
                  <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                    {feature.name}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
