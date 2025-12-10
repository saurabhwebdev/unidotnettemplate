import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { colors } from '../config/theme.config';
import { api } from '../services/api';
import { emailPreferencesService, type EmailPreference } from '../services/emailPreferences.service';
import { Send, CheckCircle, XCircle, Loader, ChevronDown } from 'lucide-react';

// Collapsible content component with smooth height animation
function CollapsibleContent({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      // Measure content height and animate to it
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);
    } else {
      // Collapse to 0
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      style={{
        height: height === 0 ? '0px' : isOpen ? `${height}px` : '0px',
        overflow: 'hidden',
        transition: 'height 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms ease',
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

interface EmailSettingsInfo {
  provider: string;
  fromEmail: string;
  fromName: string;
  smtp?: {
    host: string;
    port: number;
    enableSsl: boolean;
    username: string;
    hasPassword: boolean;
  };
  microsoftGraph?: {
    tenantId: string;
    clientId: string;
    hasClientSecret: boolean;
    fromEmail: string;
  };
}

export function Settings() {
  const navigate = useNavigate();
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [preferences, setPreferences] = useState<EmailPreference[]>([]);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [updatingPreference, setUpdatingPreference] = useState<number | null>(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [testEmailExpanded, setTestEmailExpanded] = useState(false);
  const [emailSettings, setEmailSettings] = useState<EmailSettingsInfo | null>(null);
  const [loadingEmailSettings, setLoadingEmailSettings] = useState(false);

  useEffect(() => {
    loadPreferences();
    // Load email settings proactively for smooth animation
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    setLoadingEmailSettings(true);
    try {
      const response = await api.get<EmailSettingsInfo>('/emailtest/settings');
      setEmailSettings(response.data);
    } catch (error) {
      console.error('Failed to load email settings:', error);
    } finally {
      setLoadingEmailSettings(false);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await emailPreferencesService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load email preferences:', error);
    } finally {
      setLoadingPreferences(false);
    }
  };

  const handleTogglePreference = async (alertType: number, currentValue: boolean) => {
    setUpdatingPreference(alertType);
    try {
      await emailPreferencesService.updatePreference(alertType, !currentValue);
      setPreferences(prev =>
        prev.map(p =>
          p.alertType === alertType ? { ...p, isEnabled: !currentValue } : p
        )
      );
    } catch (error) {
      console.error('Failed to update preference:', error);
    } finally {
      setUpdatingPreference(null);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setResult({ success: false, message: 'Please enter a valid email address' });
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await api.post('/emailtest/send-test', { toEmail: testEmail });
      setResult({ success: true, message: response.data.message || 'Test email sent successfully!' });
      setTestEmail('');
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.error || 'Failed to send email. Please check your email configuration.'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div
        className="pb-4 mb-6 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <div>
          <h1 className="text-lg font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
            Settings
          </h1>
          <p className="text-xs" style={{ color: colors.textMuted }}>
            Manage your preferences and application settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/audit-logs')}
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
          >
            Audit Logs
          </button>
          <button
            onClick={() => navigate('/version')}
            className="px-3 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary
            }}
          >
            Version Info
          </button>
        </div>
      </div>

      {/* Email Notifications Section */}
      <div className="mb-6" style={{ border: `1px solid ${colors.border}` }}>
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          style={{
            backgroundColor: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`
          }}
          onClick={() => setNotificationsExpanded(!notificationsExpanded)}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Email Notifications
          </h2>
          <ChevronDown
            size={16}
            style={{
              color: colors.textMuted,
              transform: notificationsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms'
            }}
          />
        </div>

        <CollapsibleContent isOpen={notificationsExpanded}>
          <div>
            {loadingPreferences ? (
              <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                Loading...
              </div>
            ) : (
              preferences.map((pref, index) => {
                const isUpdating = updatingPreference === pref.alertType;
                return (
                  <div
                    key={pref.alertType}
                    className="grid grid-cols-3 px-4 py-3"
                    style={{
                      backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="col-span-2">
                      <div className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                        {pref.displayName}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                        {pref.alertTypeName === 'LoginAlert' && 'Get notified when someone logs into your account'}
                        {pref.alertTypeName === 'LogoutAlert' && 'Get notified when you log out of your account'}
                        {pref.alertTypeName === 'PasswordChanged' && 'Get notified when your password is changed'}
                        {pref.alertTypeName === 'EmailChanged' && 'Get notified when your email address is changed'}
                        {pref.alertTypeName === 'ProfileUpdated' && 'Get notified when your profile information is updated'}
                        {pref.alertTypeName === 'SecurityAlert' && 'Get notified about important security events'}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      {isUpdating && <Loader size={14} className="animate-spin" style={{ color: colors.primary }} />}
                      <Switch
                        checked={pref.isEnabled}
                        onCheckedChange={() => handleTogglePreference(pref.alertType, pref.isEnabled)}
                        disabled={isUpdating}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CollapsibleContent>
      </div>

      {/* Email Testing Section */}
      <div style={{ border: `1px solid ${colors.border}` }}>
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer"
          style={{
            backgroundColor: colors.bgSecondary,
            borderBottom: `1px solid ${colors.border}`
          }}
          onClick={() => setTestEmailExpanded(!testEmailExpanded)}
        >
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
            Test Email Service
          </h2>
          <ChevronDown
            size={16}
            style={{
              color: colors.textMuted,
              transform: testEmailExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms'
            }}
          />
        </div>

        <CollapsibleContent isOpen={testEmailExpanded}>
          <div className="p-4">
            {/* Email Configuration Display */}
            {loadingEmailSettings ? (
              <div className="p-4 text-sm" style={{ color: colors.textMuted }}>
                Loading configuration...
              </div>
            ) : emailSettings && (
              <div className="mb-4" style={{ border: `1px solid ${colors.border}` }}>
                <div
                  className="px-3 py-2"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderBottom: `1px solid ${colors.border}`
                  }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                    Current Configuration
                  </h3>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    Provider
                  </div>
                  <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                    {emailSettings.provider}
                  </div>
                </div>
                <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                    From Email
                  </div>
                  <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                    {emailSettings.fromName ? `${emailSettings.fromName} <${emailSettings.fromEmail}>` : emailSettings.fromEmail}
                  </div>
                </div>
                {emailSettings.smtp && (
                  <>
                    <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        SMTP Host
                      </div>
                      <div className="col-span-2 text-xs font-mono" style={{ color: colors.textPrimary }}>
                        {emailSettings.smtp.host}:{emailSettings.smtp.port}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        SSL Enabled
                      </div>
                      <div className="col-span-2 text-xs" style={{ color: emailSettings.smtp.enableSsl ? colors.primary : colors.error }}>
                        {emailSettings.smtp.enableSsl ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        Username
                      </div>
                      <div className="col-span-2 text-xs" style={{ color: colors.textPrimary }}>
                        {emailSettings.smtp.username || '-'}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2">
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        Password
                      </div>
                      <div className="col-span-2 text-xs" style={{ color: emailSettings.smtp.hasPassword ? colors.primary : colors.error }}>
                        {emailSettings.smtp.hasPassword ? 'Configured' : 'Not Set'}
                      </div>
                    </div>
                  </>
                )}
                {emailSettings.microsoftGraph && (
                  <>
                    <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        Tenant ID
                      </div>
                      <div className="col-span-2 text-xs font-mono" style={{ color: colors.textPrimary }}>
                        {emailSettings.microsoftGraph.tenantId}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        Client ID
                      </div>
                      <div className="col-span-2 text-xs font-mono" style={{ color: colors.textPrimary }}>
                        {emailSettings.microsoftGraph.clientId}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 px-3 py-2">
                      <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
                        Client Secret
                      </div>
                      <div className="col-span-2 text-xs" style={{ color: emailSettings.microsoftGraph.hasClientSecret ? colors.primary : colors.error }}>
                        {emailSettings.microsoftGraph.hasClientSecret ? 'Configured' : 'Not Set'}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Send Test Email Form */}
            <div className="space-y-3">
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Send Test Email
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email address"
                  disabled={sending}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendTestEmail()}
                  className="flex-1 text-sm"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary
                  }}
                />
                <Button
                  onClick={handleSendTestEmail}
                  disabled={sending || !testEmail}
                  className="text-xs flex items-center gap-2 px-4 py-2"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  {sending ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Send
                    </>
                  )}
                </Button>
              </div>

              {result && (
                <div
                  className="p-3 flex items-center gap-2 text-xs"
                  style={{
                    backgroundColor: result.success ? colors.bgSecondary : '#fee2e2',
                    border: `1px solid ${result.success ? colors.border : '#fecaca'}`,
                    color: result.success ? colors.primary : '#dc2626'
                  }}
                >
                  {result.success ? (
                    <CheckCircle size={14} style={{ color: colors.primary }} />
                  ) : (
                    <XCircle size={14} style={{ color: '#dc2626' }} />
                  )}
                  <span>{result.message}</span>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </DashboardLayout>
  );
}
