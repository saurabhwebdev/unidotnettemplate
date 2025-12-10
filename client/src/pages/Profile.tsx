import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'boring-avatars';
import { authService } from '../services/auth.service';
import type { User, UpdateProfileRequest } from '../services/auth.service';
import { usersService } from '../services/users.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { colors } from '../config/theme.config';
import { Pencil, X, Check, Loader2 } from 'lucide-react';

const AVATAR_VARIANTS = ['marble', 'beam', 'pixel', 'sunset', 'ring', 'bauhaus'] as const;
const AVATAR_COLORS_PRESETS = [
  ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  ['#A3D9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'],
  ['#11998e', '#38ef7d', '#00b4db', '#0083b0', '#00d2d3'],
  ['#ff9a9e', '#fecfef', '#feada6', '#fbc2eb', '#a18cd1'],
  ['#2c3e50', '#3498db', '#e74c3c', '#1abc9c', '#9b59b6'],
];

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<typeof AVATAR_VARIANTS[number]>('marble');
  const [selectedColors, setSelectedColors] = useState(0);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    phoneNumber: null,
    officeLocation: null
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        if (userData.avatarColor) {
          try {
            const savedSettings = JSON.parse(userData.avatarColor);
            setSelectedVariant(savedSettings.variant || 'marble');
            setSelectedColors(savedSettings.colorIndex || 0);
          } catch {
            // Use defaults
          }
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSaveAvatar = async () => {
    if (!user) return;
    setSavingAvatar(true);
    try {
      const avatarSettings = JSON.stringify({
        variant: selectedVariant,
        colorIndex: selectedColors
      });
      await usersService.updateAvatar(user.id, {
        avatarUrl: null,
        avatarColor: avatarSettings
      });
      setUser({ ...user, avatarColor: avatarSettings });
      setShowAvatarEditor(false);
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    } catch (error) {
      console.error('Failed to save avatar:', error);
    } finally {
      setSavingAvatar(false);
    }
  };

  const getCurrentAvatarSettings = () => {
    if (user?.avatarColor) {
      try {
        const saved = JSON.parse(user.avatarColor);
        return {
          variant: saved.variant || 'marble',
          colorIndex: saved.colorIndex || 0
        };
      } catch {
        return { variant: 'marble' as const, colorIndex: 0 };
      }
    }
    return { variant: 'marble' as const, colorIndex: 0 };
  };

  const handleStartEdit = () => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || null,
        officeLocation: user.officeLocation || null
      });
      setIsEditing(true);
      setSaveError(null);
      setSaveSuccess(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: '',
      lastName: '',
      phoneNumber: null,
      officeLocation: null
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updatedUser = await authService.updateProfile(editForm);
      setUser(updatedUser);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setSaveError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <DashboardLayout><div style={{ color: colors.textMuted }}>Loading...</div></DashboardLayout>;
  }

  const currentSettings = getCurrentAvatarSettings();

  const DataRow = ({ label, value, editable = false, field = '', type = 'text', adminOnly = false }: {
    label: string;
    value: string | null | undefined;
    editable?: boolean;
    field?: keyof UpdateProfileRequest;
    type?: string;
    adminOnly?: boolean;
  }) => (
    <div
      className="grid grid-cols-3 py-3 px-4"
      style={{ borderBottom: `1px solid ${colors.border}` }}
    >
      <div className="col-span-1">
        <label className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.textMuted }}>
          {label}
        </label>
      </div>
      <div className="col-span-2">
        {isEditing && editable && field ? (
          <Input
            type={type}
            value={(editForm[field] as string) || ''}
            onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value || null })}
            className="h-8 text-sm"
            style={{
              borderColor: colors.border,
              color: colors.textPrimary,
              backgroundColor: colors.bgSecondary
            }}
          />
        ) : (
          <div>
            <p className="text-sm" style={{ color: value ? colors.textPrimary : colors.textMuted }}>
              {value || '-'}
            </p>
            {adminOnly && !value && (
              <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                Contact your administrator to set
              </p>
            )}
            {adminOnly && value && isEditing && (
              <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                Admin-managed field
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Success/Error Messages */}
      {saveSuccess && (
        <div
          className="text-sm p-3 mb-4 flex items-center gap-2"
          style={{ backgroundColor: colors.bgSecondary, color: colors.primary, border: `1px solid ${colors.border}` }}
        >
          <Check className="h-4 w-4" />
          Profile updated successfully
        </div>
      )}
      {saveError && (
        <div
          className="text-sm p-3 mb-4"
          style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          {saveError}
        </div>
      )}

      {/* Profile Header Bar */}
      <div
        className="flex items-center justify-between p-4 mb-6"
        style={{
          backgroundColor: colors.bgSecondary,
          border: `1px solid ${colors.border}`
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="h-16 w-16 rounded-full overflow-hidden cursor-pointer">
              <Avatar
                size={64}
                name={`${user?.firstName} ${user?.lastName}`}
                variant={currentSettings.variant}
                colors={AVATAR_COLORS_PRESETS[currentSettings.colorIndex]}
              />
              <div
                onClick={() => setShowAvatarEditor(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold mb-0.5" style={{ color: colors.textPrimary }}>
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs mb-0.5" style={{ color: colors.textMuted }}>
              {user?.email}
            </p>
            <div
              className="inline-block px-2 py-0.5 text-xs"
              style={{
                backgroundColor: colors.bgPrimary,
                color: colors.primary,
                border: `1px solid ${colors.border}`
              }}
            >
              Active
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartEdit}
              className="flex items-center gap-2 h-8 text-xs"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 h-8 text-xs"
                style={{ borderColor: colors.border, color: colors.textMuted }}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="flex items-center gap-2 h-8 text-xs"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                {savingProfile ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div style={{ border: `1px solid ${colors.border}` }}>
          <div
            className="px-4 py-3"
            style={{
              backgroundColor: colors.bgSecondary,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
              Personal Information
            </h2>
          </div>
          <div>
            <DataRow label="First Name" value={user?.firstName} editable field="firstName" />
            <DataRow label="Last Name" value={user?.lastName} editable field="lastName" />
            <DataRow label="Email" value={user?.email} />
            <DataRow label="Phone" value={user?.phoneNumber} editable field="phoneNumber" type="tel" />
            <DataRow label="Office Location" value={user?.officeLocation} editable field="officeLocation" />
            <DataRow label="User ID" value={user?.id} />
          </div>
        </div>

        {/* Employee Information */}
        <div style={{ border: `1px solid ${colors.border}` }}>
          <div
            className="px-4 py-3"
            style={{
              backgroundColor: colors.bgSecondary,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
              Employee Information
            </h2>
          </div>
          <div>
            <DataRow label="Employee ID" value={user?.employeeId} adminOnly={true} />
            <DataRow label="Designation" value={user?.designation} adminOnly={true} />
            <DataRow label="Department" value={user?.department} adminOnly={true} />
            <DataRow label="Date of Joining" value={formatDate(user?.dateOfJoining)} adminOnly={true} />
            <DataRow label="Reports To" value={user?.reportsToName} adminOnly={true} />
          </div>
        </div>
      </div>

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-lg"
            style={{ backgroundColor: colors.bgPrimary, border: `1px solid ${colors.border}` }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                backgroundColor: colors.bgSecondary,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <h2 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                Customize Avatar
              </h2>
              <button
                onClick={() => setShowAvatarEditor(false)}
                className="p-1.5 transition-colors"
                style={{ color: colors.textMuted }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden">
                  <Avatar
                    size={128}
                    name={`${user?.firstName} ${user?.lastName}`}
                    variant={selectedVariant}
                    colors={AVATAR_COLORS_PRESETS[selectedColors]}
                  />
                </div>
              </div>

              {/* Variant Selection */}
              <div className="mb-6">
                <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: colors.textMuted }}>
                  Avatar Style
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_VARIANTS.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className="p-2 transition-all"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        border: selectedVariant === variant ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`
                      }}
                    >
                      <Avatar
                        size={40}
                        name={`${user?.firstName} ${user?.lastName}`}
                        variant={variant}
                        colors={AVATAR_COLORS_PRESETS[selectedColors]}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label className="text-xs font-medium mb-3 block uppercase tracking-wider" style={{ color: colors.textMuted }}>
                  Color Palette
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_COLORS_PRESETS.map((colorSet, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColors(index)}
                      className="h-10 transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${colorSet[0]} 0%, ${colorSet[1]} 25%, ${colorSet[2]} 50%, ${colorSet[3]} 75%, ${colorSet[4]} 100%)`,
                        border: selectedColors === index ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAvatarEditor(false)}
                  className="h-8 text-xs"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveAvatar}
                  disabled={savingAvatar}
                  className="h-8 text-xs"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  {savingAvatar ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
