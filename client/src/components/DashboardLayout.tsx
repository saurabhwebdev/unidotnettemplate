import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Settings,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Avatar from 'boring-avatars';
import { authService } from '../services/auth.service';
import type { User as UserType } from '../services/auth.service';
import { Button } from './ui/button';
import { Tooltip } from './ui/tooltip';
import { cn } from '../lib/utils';
import { colors, withOpacity } from '../config/theme.config';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Roles & Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, [navigate]);

  // Listen for avatar updates from Profile page
  useEffect(() => {
    const handleAvatarUpdate = () => {
      fetchUser();
    };
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const AVATAR_COLORS_PRESETS = [
    ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
    ['#A3D9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
    ['#11998e', '#38ef7d', '#00b4db', '#0083b0', '#00d2d3'],
    ['#ff9a9e', '#fecfef', '#feada6', '#fbc2eb', '#a18cd1'],
    ['#2c3e50', '#3498db', '#e74c3c', '#1abc9c', '#9b59b6'],
  ];

  const renderAvatar = (size: number) => {
    if (user?.avatarColor) {
      try {
        const saved = JSON.parse(user.avatarColor);
        const variant = saved.variant || 'marble';
        const colorIndex = saved.colorIndex || 0;
        return (
          <Avatar
            size={size}
            name={`${user.firstName} ${user.lastName}`}
            variant={variant as 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus'}
            colors={AVATAR_COLORS_PRESETS[colorIndex] || AVATAR_COLORS_PRESETS[0]}
          />
        );
      } catch {
        return null;
      }
    }
    return null;
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    const breadcrumbs = [
      { name: 'Home', path: '/dashboard' }
    ];

    if (segments.length > 0 && segments[0] !== 'dashboard') {
      let pageName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
      if (segments[0] === 'users') {
        pageName = 'Roles & Users';
      }
      breadcrumbs.push({ name: pageName, path });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bgSecondary }}>
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out hidden lg:block',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
        style={{
          backgroundColor: colors.bgPrimary,
          borderRight: `1px solid ${colors.border}`
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 items-center px-4",
              sidebarOpen ? "justify-start" : "justify-center"
            )}
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: colors.primary }}
              >
                U
              </div>
              {sidebarOpen && (
                <span
                  className="font-semibold text-lg"
                  style={{ color: colors.textPrimary }}
                >
                  UniTemplate
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              const linkElement = (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    !sidebarOpen && 'justify-center'
                  )}
                  style={{
                    backgroundColor: isActive ? colors.primaryLight : 'transparent',
                    color: isActive ? colors.primary : colors.textSecondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.bgHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );

              return !sidebarOpen ? (
                <Tooltip key={item.name} content={item.name} side="right">
                  {linkElement}
                </Tooltip>
              ) : (
                linkElement
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div
            className="p-3 space-y-1"
          >
            {/* Logout Button */}
            {!sidebarOpen ? (
              <Tooltip content="Logout" side="right">
                <button
                  onClick={handleLogout}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                    !sidebarOpen && 'justify-center'
                  )}
                  style={{ color: colors.error }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.errorLight;
                    e.currentTarget.style.color = colors.errorHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = colors.error;
                  }}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                  !sidebarOpen && 'justify-center'
                )}
                style={{ color: colors.error }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.errorLight;
                  e.currentTarget.style.color = colors.errorHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.error;
                }}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            )}

            {/* Collapse/Expand Button */}
            {!sidebarOpen ? (
              <Tooltip content="Expand" side="right">
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                    !sidebarOpen && 'justify-center'
                  )}
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ChevronLeft
                    className={cn(
                      'h-5 w-5 flex-shrink-0 transition-transform',
                      !sidebarOpen && 'rotate-180 animate-nudge'
                    )}
                  />
                  {sidebarOpen && <span>Collapse</span>}
                </button>
              </Tooltip>
            ) : (
              <button
                onClick={toggleSidebar}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full',
                  !sidebarOpen && 'justify-center'
                )}
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ChevronLeft
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-transform',
                    !sidebarOpen && 'rotate-180 animate-nudge'
                  )}
                />
                {sidebarOpen && <span>Collapse</span>}
              </button>
            )}
          </div>

        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: withOpacity(colors.textPrimary, 0.5) }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className="fixed left-0 top-0 z-50 h-screen w-64 lg:hidden"
            style={{
              backgroundColor: colors.bgPrimary,
              borderRight: `1px solid ${colors.border}`
            }}
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div
                className="flex h-16 items-center justify-between px-4"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    U
                  </div>
                  <span
                    className="font-semibold text-lg"
                    style={{ color: colors.textPrimary }}
                  >
                    UniTemplate
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: colors.textSecondary }}
                >
                  <X className="h-5 w-5" style={{ color: colors.textSecondary }} />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: isActive ? colors.primaryLight : 'transparent',
                        color: isActive ? colors.primary : colors.textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = colors.bgHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        )}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-4 px-4 sm:px-6"
          style={{
            backgroundColor: colors.bgPrimary,
            borderBottom: `1px solid ${colors.border}`
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            style={{ color: colors.textSecondary }}
          >
            <Menu className="h-5 w-5" style={{ color: colors.textSecondary }} />
          </Button>

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 flex-1">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight
                    className="h-4 w-4"
                    style={{ color: colors.textMuted }}
                  />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: colors.textMuted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.textMuted;
                    }}
                  >
                    {index === 0 && <Home className="h-4 w-4" />}
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="h-10 w-10 rounded-full flex items-center justify-center font-medium text-sm text-white transition-transform hover:scale-105 overflow-hidden"
              style={!user?.avatarColor ? {
                background: 'linear-gradient(135deg, #3cca70 0%, #2a9d5a 100%)'
              } : undefined}
            >
              {renderAvatar(40) || getInitials()}
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 overflow-hidden"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {/* Profile Info */}
                  <div className="p-4" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white overflow-hidden"
                        style={!user?.avatarColor ? {
                          background: 'linear-gradient(135deg, #3cca70 0%, #2a9d5a 100%)'
                        } : undefined}
                      >
                        {renderAvatar(48) || getInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-semibold truncate"
                          style={{ color: colors.textPrimary }}
                        >
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p
                          className="text-sm truncate"
                          style={{ color: colors.textMuted }}
                        >
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                      style={{
                        backgroundColor: colors.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#34b563';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primary;
                      }}
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: colors.textSecondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.bgHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                      style={{ color: colors.error }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.errorLight;
                        e.currentTarget.style.color = colors.errorHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.error;
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
          <div
            key={location.pathname}
            className="animate-fade-in"
          >
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="px-4 sm:px-6 lg:px-8 py-4 text-center text-sm"
          style={{
            color: colors.textMuted,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          © {new Date().getFullYear()} Unison Mining PTE Ltd. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
