import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from 'boring-avatars';
import { authService } from '../services/auth.service';
import type { User, UpdateProfileRequest } from '../services/auth.service';
import { usersService } from '../services/users.service';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { colors } from '../config/theme.config';
import { Pencil, X, Check, Loader2, Building2, Phone, MapPin, Calendar, Users, Briefcase, BadgeCheck } from 'lucide-react';

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
        // Parse saved avatar settings if exists
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
      // Dispatch event to notify header to update
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
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      // Dispatch event to notify header to update
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setSaveError(error.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid gap-6">
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" variant="circular" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full max-w-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full max-w-md" />
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <Skeleton className="h-7 w-40 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const currentSettings = getCurrentAvatarSettings();

  return (
    <DashboardLayout>
      <div className="grid gap-6">
          {/* Profile Header Card */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-full overflow-hidden"
                    style={{
                      boxShadow: `0 0 0 4px ${colors.primary}, 0 0 0 6px ${colors.bgPrimary}`
                    }}
                  >
                    <Avatar
                      size={96}
                      name={`${user?.firstName} ${user?.lastName}`}
                      variant={currentSettings.variant}
                      colors={AVATAR_COLORS_PRESETS[currentSettings.colorIndex]}
                    />
                  </div>
                  <button
                    onClick={() => setShowAvatarEditor(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <h2
                    className="text-2xl font-bold mb-1"
                    style={{ color: colors.textPrimary }}
                  >
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p
                    className="text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    {user?.email}
                  </p>
                  <div
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Active User
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle style={{ color: colors.textPrimary }}>Personal Information</CardTitle>
                <CardDescription style={{ color: colors.textMuted }}>
                  Your account details and information
                </CardDescription>
              </div>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartEdit}
                  className="flex items-center gap-2"
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2"
                    style={{ borderColor: colors.border, color: colors.textMuted }}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="flex items-center gap-2"
                    style={{ backgroundColor: colors.primary, color: 'white' }}
                  >
                    {savingProfile ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4" style={{ color: colors.textSecondary }}>
              {/* Success/Error Messages */}
              {saveSuccess && (
                <div
                  className="text-sm p-3 rounded-md flex items-center gap-2"
                  style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                >
                  <Check className="h-4 w-4" />
                  Profile updated successfully!
                </div>
              )}
              {saveError && (
                <div
                  className="text-sm p-3 rounded-md"
                  style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                >
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: colors.textMuted }}
                  >
                    First Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                    />
                  ) : (
                    <p style={{ color: colors.textPrimary }}>{user?.firstName}</p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1"
                    style={{ color: colors.textMuted }}
                  >
                    Last Name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                    />
                  ) : (
                    <p style={{ color: colors.textPrimary }}>{user?.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: colors.textMuted }}
                >
                  Email Address
                </label>
                <p style={{ color: colors.textPrimary }}>{user?.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.phoneNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value || null })}
                      placeholder="Enter phone number"
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                    />
                  ) : (
                    <p style={{ color: user?.phoneNumber ? colors.textPrimary : colors.textMuted }}>
                      {user?.phoneNumber || 'Not set'}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <MapPin className="h-4 w-4" />
                    Office Location
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.officeLocation || ''}
                      onChange={(e) => setEditForm({ ...editForm, officeLocation: e.target.value || null })}
                      placeholder="Enter office location"
                      style={{ borderColor: colors.border, color: colors.textPrimary }}
                    />
                  ) : (
                    <p style={{ color: user?.officeLocation ? colors.textPrimary : colors.textMuted }}>
                      {user?.officeLocation || 'Not set'}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium block mb-1"
                  style={{ color: colors.textMuted }}
                >
                  User ID
                </label>
                <p
                  className="font-mono text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {user?.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Employee Information */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                <Briefcase className="h-5 w-5" />
                Employee Information
              </CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                Your organizational details (managed by administrators)
              </CardDescription>
            </CardHeader>
            <CardContent style={{ color: colors.textSecondary }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Employee ID
                  </label>
                  <p style={{ color: user?.employeeId ? colors.textPrimary : colors.textMuted }}>
                    {user?.employeeId || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <Briefcase className="h-4 w-4" />
                    Designation
                  </label>
                  <p style={{ color: user?.designation ? colors.textPrimary : colors.textMuted }}>
                    {user?.designation || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <Building2 className="h-4 w-4" />
                    Department
                  </label>
                  <p style={{ color: user?.department ? colors.textPrimary : colors.textMuted }}>
                    {user?.department || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <Calendar className="h-4 w-4" />
                    Date of Joining
                  </label>
                  <p style={{ color: user?.dateOfJoining ? colors.textPrimary : colors.textMuted }}>
                    {formatDate(user?.dateOfJoining)}
                  </p>
                </div>
                <div className="col-span-2">
                  <label
                    className="text-sm font-medium block mb-1 flex items-center gap-2"
                    style={{ color: colors.textMuted }}
                  >
                    <Users className="h-4 w-4" />
                    Reports To
                  </label>
                  <p style={{ color: user?.reportsToName ? colors.textPrimary : colors.textMuted }}>
                    {user?.reportsToName || 'Not assigned'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <CardTitle style={{ color: colors.textPrimary }}>Account Status</CardTitle>
              <CardDescription style={{ color: colors.textMuted }}>
                Information about your account status
              </CardDescription>
            </CardHeader>
            <CardContent style={{ color: colors.textSecondary }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Email Verified</span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.primaryLight,
                      color: colors.primary
                    }}
                  >
                    Yes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-lg rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: colors.border }}
            >
              <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                Customize Avatar
              </h2>
              <button
                onClick={() => setShowAvatarEditor(false)}
                className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
                style={{ backgroundColor: colors.bgTertiary }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Preview */}
              <div className="flex justify-center mb-6">
                <div className="h-32 w-32 rounded-full overflow-hidden"
                  style={{ boxShadow: `0 0 0 4px ${colors.primary}` }}
                >
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
                <label className="text-sm font-medium mb-3 block" style={{ color: colors.textMuted }}>
                  Avatar Style
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_VARIANTS.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: colors.bgTertiary,
                        boxShadow: selectedVariant === variant ? `0 0 0 2px ${colors.primary}` : 'none'
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
                <label className="text-sm font-medium mb-3 block" style={{ color: colors.textMuted }}>
                  Color Palette
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_COLORS_PRESETS.map((colorSet, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColors(index)}
                      className="h-10 rounded-lg transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${colorSet[0]} 0%, ${colorSet[1]} 25%, ${colorSet[2]} 50%, ${colorSet[3]} 75%, ${colorSet[4]} 100%)`,
                        boxShadow: selectedColors === index ? `0 0 0 2px ${colors.primary}` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowAvatarEditor(false)}
                  style={{ borderColor: colors.border, color: colors.textPrimary }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAvatar}
                  disabled={savingAvatar}
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  {savingAvatar ? 'Saving...' : 'Save Avatar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
