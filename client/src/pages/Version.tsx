import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { colors } from '../config/theme.config';
import {
  Rocket,
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
  Monitor,
  Layers,
  RefreshCw,
  Lock,
  FileText,
  Wrench,
  Zap,
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
};

export default function Version() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Main Version Card */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Rocket size={40} style={{ color: colors.primary }} />
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                UniTemplate
              </h1>
              <p className="text-lg mb-4" style={{ color: colors.textMuted }}>
                Universal .NET + React Template
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <span className="text-sm font-semibold" style={{ color: colors.primary }}>
                  Version {stackInfo.version}
                </span>
              </div>
              <p className="text-sm mt-4" style={{ color: colors.textMuted }}>
                Build Date: {stackInfo.buildDate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Backend Stack */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{ color: colors.textPrimary }}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Monitor size={20} style={{ color: colors.primary }} />
              </div>
              Backend Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stackInfo.backend.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.textPrimary }}>
                        {item.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>
                        v{item.version}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Frontend Stack */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{ color: colors.textPrimary }}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Palette size={20} style={{ color: colors.primary }} />
              </div>
              Frontend Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stackInfo.frontend.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.textPrimary }}>
                        {item.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>
                        v{item.version}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tools & Libraries */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{ color: colors.textPrimary }}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Wrench size={20} style={{ color: colors.primary }} />
              </div>
              Tools & Libraries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stackInfo.tools.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: colors.textPrimary }}>
                        {item.name}
                      </p>
                      <p className="text-sm" style={{ color: colors.textMuted }}>
                        v{item.version}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Architecture Info */}
        <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3" style={{ color: colors.textPrimary }}>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Layers size={20} style={{ color: colors.primary }} />
              </div>
              Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Layers size={20} style={{ color: colors.primary }} />
                  </div>
                  <p className="font-semibold" style={{ color: colors.textPrimary }}>
                    Clean Architecture
                  </p>
                </div>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Separation of concerns with API, Core, and Data layers
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#3B82F615' }}
                  >
                    <RefreshCw size={20} style={{ color: '#3B82F6' }} />
                  </div>
                  <p className="font-semibold" style={{ color: colors.textPrimary }}>
                    RESTful API
                  </p>
                </div>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Standard REST endpoints with JWT authentication
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#10B98115' }}
                  >
                    <Lock size={20} style={{ color: '#10B981' }} />
                  </div>
                  <p className="font-semibold" style={{ color: colors.textPrimary }}>
                    Role-Based Access
                  </p>
                </div>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Granular permissions with role management
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#F5656515' }}
                  >
                    <FileText size={20} style={{ color: '#F56565' }} />
                  </div>
                  <p className="font-semibold" style={{ color: colors.textPrimary }}>
                    Audit Logging
                  </p>
                </div>
                <p className="text-sm" style={{ color: colors.textMuted }}>
                  Complete activity tracking and audit trails
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Built with modern web technologies
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
