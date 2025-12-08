import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { colors } from '../config/theme.config';
import { api } from '../services/api';
import { emailPreferencesService, type EmailPreference } from '../services/emailPreferences.service';
import { Mail, Send, CheckCircle, XCircle, Loader, Bell, HelpCircle, LogIn, LogOut, Lock, AtSign, User as UserIcon, Shield, ChevronDown } from 'lucide-react';

const getIconForAlertType = (alertTypeName: string) => {
  switch (alertTypeName) {
    case 'LoginAlert':
      return LogIn;
    case 'LogoutAlert':
      return LogOut;
    case 'PasswordChanged':
      return Lock;
    case 'EmailChanged':
      return AtSign;
    case 'ProfileUpdated':
      return UserIcon;
    case 'SecurityAlert':
      return Shield;
    default:
      return Bell;
  }
};

export function Settings() {
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [preferences, setPreferences] = useState<EmailPreference[]>([]);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [updatingPreference, setUpdatingPreference] = useState<number | null>(null);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const [testEmailExpanded, setTestEmailExpanded] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

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
      <TooltipProvider>
        <div className="grid gap-6 animate-fade-in">
          {/* Email Notifications Section */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setNotificationsExpanded(!notificationsExpanded)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                    <Bell size={20} />
                    Email Notifications
                  </CardTitle>
                  <CardDescription style={{ color: colors.textMuted }}>
                    Manage which email alerts you want to receive
                  </CardDescription>
                </div>
                <ChevronDown
                  size={20}
                  style={{ color: colors.textMuted }}
                  className={`transition-transform ${notificationsExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>
            {notificationsExpanded && <CardContent>
              <div className="space-y-3">
                {loadingPreferences ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.bgSecondary }}>
                        <div className="w-full h-10 bg-gray-200 animate-pulse rounded" />
                      </div>
                    ))}
                  </>
                ) : (
                  preferences.map((pref) => {
                    const Icon = getIconForAlertType(pref.alertTypeName);
                    const isUpdating = updatingPreference === pref.alertType;

                    return (
                      <div
                        key={pref.alertType}
                        className="flex items-center justify-between p-3 rounded-lg transition-all"
                        style={{ backgroundColor: colors.bgSecondary }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 rounded" style={{ backgroundColor: colors.primaryLight }}>
                            <Icon size={18} style={{ color: colors.primary }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                                {pref.displayName}
                              </h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button className="focus:outline-none">
                                    <HelpCircle size={14} style={{ color: colors.textMuted }} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs max-w-xs">
                                    {pref.alertTypeName === 'LoginAlert' && 'Get notified when someone logs into your account'}
                                    {pref.alertTypeName === 'LogoutAlert' && 'Get notified when you log out of your account'}
                                    {pref.alertTypeName === 'PasswordChanged' && 'Get notified when your password is changed'}
                                    {pref.alertTypeName === 'EmailChanged' && 'Get notified when your email address is changed'}
                                    {pref.alertTypeName === 'ProfileUpdated' && 'Get notified when your profile information is updated'}
                                    {pref.alertTypeName === 'SecurityAlert' && 'Get notified about important security events'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUpdating && <Loader size={16} className="animate-spin" style={{ color: colors.primary }} />}
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
            </CardContent>}
          </Card>

          {/* Email Testing Card */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setTestEmailExpanded(!testEmailExpanded)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                    <Mail size={20} />
                    Test Email Service
                  </CardTitle>
                  <CardDescription style={{ color: colors.textMuted }}>
                    Send a test email to verify your configuration
                  </CardDescription>
                </div>
                <ChevronDown
                  size={20}
                  style={{ color: colors.textMuted }}
                  className={`transition-transform ${testEmailExpanded ? 'rotate-180' : ''}`}
                />
              </div>
            </CardHeader>
            {testEmailExpanded && <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={sending}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendTestEmail()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendTestEmail}
                    disabled={sending || !testEmail}
                    style={{ backgroundColor: colors.primary }}
                    className="text-white hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send
                      </>
                    )}
                  </Button>
                </div>

                {result && (
                  <div
                    className={`p-3 rounded-lg flex items-center gap-2 animate-fade-in text-sm ${
                      result.success ? 'bg-green-50' : 'bg-red-50'
                    }`}
                    style={{
                      border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`
                    }}
                  >
                    {result.success ? (
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-600 flex-shrink-0" />
                    )}
                    <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                      {result.message}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>}
          </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
