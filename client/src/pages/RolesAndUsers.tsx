import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { Pagination } from '../components/ui/pagination';
import { useToast } from '../components/ui/toast';
import { colors } from '../config/theme.config';
import { rolesService } from '../services/roles.service';
import { usersService } from '../services/users.service';
import { routesService, type ApiRoute } from '../services/routes.service';
import type { Role } from '../services/roles.service';
import type { UserWithRoles, CreateUserRequest, UpdateUserRequest } from '../services/users.service';
import {
  Users as UsersIcon,
  Shield,
  Plus,
  Edit2,
  Trash2,
  UserPlus,
  ShieldCheck,
  Search,
  Mail,
  CheckCircle2,
  XCircle,
  Key,
  Route as RouteIcon,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Check,
  Minus,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  UserCog,
  BadgeCheck,
  Loader2,
} from 'lucide-react';

export function RolesAndUsers() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'routes'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<ApiRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  // Action loading states
  const [sendingEmailFor, setSendingEmailFor] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);
  const [savingRole, setSavingRole] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [savingRoleAssignment, setSavingRoleAssignment] = useState(false);

  // Role modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // User modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isActive: true,
    employeeId: '',
    designation: '',
    department: '',
    phoneNumber: '',
    officeLocation: '',
    dateOfJoining: '',
    reportsToId: '',
    roleIds: [] as string[]
  });

  // Role assignment modal state
  const [showRoleAssignmentModal, setShowRoleAssignmentModal] = useState(false);
  const [assigningRolesFor, setAssigningRolesFor] = useState<UserWithRoles | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  // Pagination state
  const [rolesPage, setRolesPage] = useState(1);
  const [rolesPageSize, setRolesPageSize] = useState(10);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize, setUsersPageSize] = useState(10);
  const [routesPage, setRoutesPage] = useState(1);
  const [routesPageSize, setRoutesPageSize] = useState(10);

  // Permission groups expanded state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRoles();
    loadUsers();
    loadRoutes();
  }, []);

  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const data = await rolesService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadRoutes = async () => {
    setLoadingRoutes(true);
    try {
      const data = await routesService.getAllRoutes();
      setAvailableRoutes(data);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const handleCreateRole = async () => {
    setSavingRole(true);
    try {
      await rolesService.createRole(roleFormData);
      setRoleFormData({ name: '', description: '', permissions: [] });
      setShowRoleModal(false);
      loadRoles();
      addToast({ type: 'success', title: 'Role Created', message: `Role "${roleFormData.name}" has been created successfully.` });
    } catch (error: any) {
      console.error('Failed to create role:', error);
      addToast({ type: 'error', title: 'Failed to Create Role', message: error.response?.data?.message || 'An error occurred while creating the role.' });
    } finally {
      setSavingRole(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    setSavingRole(true);
    try {
      await rolesService.updateRole(editingRole.id, roleFormData);
      setRoleFormData({ name: '', description: '', permissions: [] });
      setEditingRole(null);
      setShowRoleModal(false);
      loadRoles();
      addToast({ type: 'success', title: 'Role Updated', message: `Role "${roleFormData.name}" has been updated successfully.` });
    } catch (error: any) {
      console.error('Failed to update role:', error);
      addToast({ type: 'error', title: 'Failed to Update Role', message: error.response?.data?.message || 'An error occurred while updating the role.' });
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    setDeletingRoleId(id);
    try {
      await rolesService.deleteRole(id);
      loadRoles();
      addToast({ type: 'success', title: 'Role Deleted', message: 'The role has been deleted successfully.' });
    } catch (error: any) {
      console.error('Failed to delete role:', error);
      addToast({ type: 'error', title: 'Failed to Delete Role', message: error.response?.data?.message || 'An error occurred while deleting the role.' });
    } finally {
      setDeletingRoleId(null);
    }
  };

  const getDefaultUserFormData = () => ({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isActive: true,
    employeeId: '',
    designation: '',
    department: '',
    phoneNumber: '',
    officeLocation: '',
    dateOfJoining: '',
    reportsToId: '',
    roleIds: [] as string[]
  });

  const handleCreateUser = async () => {
    setSavingUser(true);
    try {
      const createData: CreateUserRequest = {
        email: userFormData.email,
        password: userFormData.password,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        employeeId: userFormData.employeeId || null,
        designation: userFormData.designation || null,
        department: userFormData.department || null,
        phoneNumber: userFormData.phoneNumber || null,
        officeLocation: userFormData.officeLocation || null,
        dateOfJoining: userFormData.dateOfJoining || null,
        reportsToId: userFormData.reportsToId || null,
        roleIds: userFormData.roleIds
      };
      await usersService.createUser(createData);
      setUserFormData(getDefaultUserFormData());
      setShowUserModal(false);
      loadUsers();
      addToast({ type: 'success', title: 'User Created', message: `User "${userFormData.firstName} ${userFormData.lastName}" has been created successfully.` });
    } catch (error: any) {
      console.error('Failed to create user:', error);
      addToast({ type: 'error', title: 'Failed to Create User', message: error.response?.data?.message || 'An error occurred while creating the user.' });
    } finally {
      setSavingUser(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    try {
      const updateData: UpdateUserRequest = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        isActive: userFormData.isActive,
        employeeId: userFormData.employeeId || null,
        designation: userFormData.designation || null,
        department: userFormData.department || null,
        phoneNumber: userFormData.phoneNumber || null,
        officeLocation: userFormData.officeLocation || null,
        dateOfJoining: userFormData.dateOfJoining || null,
        reportsToId: userFormData.reportsToId || null
      };
      await usersService.updateUser(editingUser.id, updateData);
      setUserFormData(getDefaultUserFormData());
      setEditingUser(null);
      setShowUserModal(false);
      loadUsers();
      addToast({ type: 'success', title: 'User Updated', message: `User "${userFormData.firstName} ${userFormData.lastName}" has been updated successfully.` });
    } catch (error: any) {
      console.error('Failed to update user:', error);
      addToast({ type: 'error', title: 'Failed to Update User', message: error.response?.data?.message || 'An error occurred while updating the user.' });
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setDeletingUserId(id);
    try {
      await usersService.deleteUser(id);
      loadUsers();
      addToast({ type: 'success', title: 'User Deleted', message: 'The user has been deleted successfully.' });
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      addToast({ type: 'error', title: 'Failed to Delete User', message: error.response?.data?.message || 'An error occurred while deleting the user.' });
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleAssignRoles = async () => {
    if (!assigningRolesFor) return;
    setSavingRoleAssignment(true);
    try {
      await usersService.assignRoles(assigningRolesFor.id, { roleIds: selectedRoleIds });
      const userName = `${assigningRolesFor.firstName} ${assigningRolesFor.lastName}`;
      setAssigningRolesFor(null);
      setSelectedRoleIds([]);
      setShowRoleAssignmentModal(false);
      loadUsers();
      addToast({ type: 'success', title: 'Roles Assigned', message: `Roles have been assigned to ${userName} successfully.` });
    } catch (error: any) {
      console.error('Failed to assign roles:', error);
      addToast({ type: 'error', title: 'Failed to Assign Roles', message: error.response?.data?.message || 'An error occurred while assigning roles.' });
    } finally {
      setSavingRoleAssignment(false);
    }
  };

  const handleSendUserDetails = async (user: UserWithRoles) => {
    setSendingEmailFor(user.id);
    try {
      await usersService.sendUserDetails(user.id);
      addToast({ type: 'success', title: 'Email Sent', message: `User details have been sent to ${user.email} successfully.` });
    } catch (error: any) {
      console.error('Failed to send user details:', error);
      addToast({ type: 'error', title: 'Failed to Send Email', message: error.response?.data?.message || 'An error occurred while sending the email.' });
    } finally {
      setSendingEmailFor(null);
    }
  };

  const openRoleModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setRoleFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions?.map(p => `${p.method}:${p.route}`) || []
      });
    } else {
      setEditingRole(null);
      setRoleFormData({ name: '', description: '', permissions: [] });
    }
    setShowRoleModal(true);
  };

  const openUserModal = (user?: UserWithRoles) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        email: user.email,
        password: '',
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        employeeId: user.employeeId || '',
        designation: user.designation || '',
        department: user.department || '',
        phoneNumber: user.phoneNumber || '',
        officeLocation: user.officeLocation || '',
        dateOfJoining: user.dateOfJoining ? user.dateOfJoining.split('T')[0] : '',
        reportsToId: user.reportsToId || '',
        roleIds: user.roles.map(r => r.id)
      });
    } else {
      setEditingUser(null);
      setUserFormData(getDefaultUserFormData());
    }
    setShowUserModal(true);
  };

  const openRoleAssignmentModal = (user: UserWithRoles) => {
    setAssigningRolesFor(user);
    setSelectedRoleIds(user.roles.map(r => r.id));
    setShowRoleAssignmentModal(true);
  };

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleRoleInUserForm = (roleId: string) => {
    setUserFormData(prev => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter(id => id !== roleId)
        : [...prev.roleIds, roleId]
    }));
  };

  const togglePermission = (permission: string) => {
    setRoleFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  // Permission group configuration - maps controller names to user-friendly feature names
  const permissionGroupConfig: Record<string, { name: string; description: string; icon: string }> = {
    'Users': { name: 'User Management', description: 'Create, view, update, and delete users', icon: 'users' },
    'Roles': { name: 'Role Management', description: 'Manage roles and permissions', icon: 'shield' },
    'Auth': { name: 'Authentication', description: 'Login, logout, and password management', icon: 'key' },
    'AuditLogs': { name: 'Audit Logs', description: 'View system activity and logs', icon: 'file-text' },
    'Routes': { name: 'API Routes', description: 'View available API endpoints', icon: 'route' },
    'EmailPreferences': { name: 'Email Settings', description: 'Manage email notification preferences', icon: 'mail' },
    'EmailTest': { name: 'Email Testing', description: 'Test email configuration', icon: 'send' },
  };

  // Group routes by controller
  const groupedRoutes = useMemo(() => {
    const groups: Record<string, ApiRoute[]> = {};
    availableRoutes.forEach(route => {
      const controller = route.controller || 'Other';
      if (!groups[controller]) {
        groups[controller] = [];
      }
      groups[controller].push(route);
    });
    // Sort routes within each group by method priority (GET, POST, PUT, DELETE)
    const methodOrder = ['GET', 'POST', 'PUT', 'DELETE'];
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => methodOrder.indexOf(a.method) - methodOrder.indexOf(b.method));
    });
    return groups;
  }, [availableRoutes]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const toggleAllInGroup = (groupName: string) => {
    const groupRoutes = groupedRoutes[groupName] || [];
    const groupPermissions = groupRoutes.map(r => `${r.method}:${r.route}`);
    const allSelected = groupPermissions.every(p => roleFormData.permissions.includes(p));

    setRoleFormData(prev => {
      if (allSelected) {
        // Deselect all in this group
        return {
          ...prev,
          permissions: prev.permissions.filter(p => !groupPermissions.includes(p))
        };
      } else {
        // Select all in this group
        const newPermissions = new Set([...prev.permissions, ...groupPermissions]);
        return {
          ...prev,
          permissions: Array.from(newPermissions)
        };
      }
    });
  };

  const getGroupSelectionState = (groupName: string): 'none' | 'some' | 'all' => {
    const groupRoutes = groupedRoutes[groupName] || [];
    if (groupRoutes.length === 0) return 'none';

    const groupPermissions = groupRoutes.map(r => `${r.method}:${r.route}`);
    const selectedCount = groupPermissions.filter(p => roleFormData.permissions.includes(p)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === groupPermissions.length) return 'all';
    return 'some';
  };

  const filteredUsers = useMemo(() => users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  ), [users, searchQuery]);

  const filteredRoles = useMemo(() => roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  ), [roles, searchQuery]);

  const filteredRoutes = useMemo(() => availableRoutes.filter(route =>
    route.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.method.toLowerCase().includes(searchQuery.toLowerCase())
  ), [availableRoutes, searchQuery]);

  // Paginated data
  const paginatedRoles = useMemo(() => {
    const start = (rolesPage - 1) * rolesPageSize;
    return filteredRoles.slice(start, start + rolesPageSize);
  }, [filteredRoles, rolesPage, rolesPageSize]);

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * usersPageSize;
    return filteredUsers.slice(start, start + usersPageSize);
  }, [filteredUsers, usersPage, usersPageSize]);

  const paginatedRoutes = useMemo(() => {
    const start = (routesPage - 1) * routesPageSize;
    return filteredRoutes.slice(start, start + routesPageSize);
  }, [filteredRoutes, routesPage, routesPageSize]);

  // Reset page when search changes
  useEffect(() => {
    setRolesPage(1);
    setUsersPage(1);
    setRoutesPage(1);
  }, [searchQuery]);

  return (
    <DashboardLayout>
      <div>
        {/* Header with Tabs */}
        <div className="flex items-center gap-0 mb-6" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <button
          onClick={() => setActiveTab('roles')}
          className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200"
          style={{
            color: activeTab === 'roles' ? colors.textPrimary : colors.textMuted,
            borderBottom: activeTab === 'roles' ? `2px solid ${colors.primary}` : '2px solid transparent',
            backgroundColor: activeTab === 'roles' ? colors.bgSecondary : 'transparent'
          }}
        >
          Roles
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200"
          style={{
            color: activeTab === 'users' ? colors.textPrimary : colors.textMuted,
            borderBottom: activeTab === 'users' ? `2px solid ${colors.primary}` : '2px solid transparent',
            backgroundColor: activeTab === 'users' ? colors.bgSecondary : 'transparent'
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('routes')}
          className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-200"
          style={{
            color: activeTab === 'routes' ? colors.textPrimary : colors.textMuted,
            borderBottom: activeTab === 'routes' ? `2px solid ${colors.primary}` : '2px solid transparent',
            backgroundColor: activeTab === 'routes' ? colors.bgSecondary : 'transparent'
          }}
        >
          API Routes
        </button>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div>
          {/* Toolbar */}
          <div
            className="p-3 mb-4 flex items-center justify-between"
            style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles..."
                className="px-3 py-1.5 text-sm w-64 focus:outline-none"
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
              />
            </div>
            <button
              onClick={() => openRoleModal()}
              className="px-3 py-1.5 text-xs font-medium flex items-center gap-2"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <Plus size={14} />
              Create Role
            </button>
          </div>

          {/* Table */}
          <div style={{ border: `1px solid ${colors.border}` }}>
            {/* Table Header */}
            <div
              className="grid grid-cols-12 px-3 py-2"
              style={{
                backgroundColor: colors.bgSecondary,
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              <div className="col-span-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Role Name
              </div>
              <div className="col-span-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Description
              </div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Permissions
              </div>
              <div className="col-span-1 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                Type
              </div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: colors.textPrimary }}>
                Actions
              </div>
            </div>

            {/* Table Body */}
            {loadingRoles ? (
              <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                Loading...
              </div>
            ) : paginatedRoles.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                No roles found
              </div>
            ) : (
              <div>
                {paginatedRoles.map((role, index) => (
                  <div
                    key={role.id}
                    className="grid grid-cols-12 px-3 py-2.5"
                    style={{
                      backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                      borderBottom: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="col-span-3 text-xs font-medium" style={{ color: colors.textPrimary }}>
                      {role.name}
                    </div>
                    <div className="col-span-4 text-xs" style={{ color: colors.textMuted }}>
                      {role.description}
                    </div>
                    <div className="col-span-2 text-xs" style={{ color: colors.textSecondary }}>
                      {role.permissions?.length || 0} permissions
                    </div>
                    <div className="col-span-1 text-xs" style={{ color: colors.textSecondary }}>
                      {role.isSystemRole ? 'System' : '-'}
                    </div>
                    <div className="col-span-2 flex gap-2 justify-end">
                      <button
                        onClick={() => openRoleModal(role)}
                        className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                        style={{ color: colors.primary }}
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      {!role.isSystemRole && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                          style={{ color: colors.error }}
                          disabled={deletingRoleId === role.id}
                        >
                          {deletingRoleId === role.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={12} />
                              Delete
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={rolesPage}
              totalPages={Math.ceil(filteredRoles.length / rolesPageSize)}
              totalCount={filteredRoles.length}
              pageSize={rolesPageSize}
              onPageChange={setRolesPage}
              onPageSizeChange={(size) => { setRolesPageSize(size); setRolesPage(1); }}
            />
          </div>
        </div>
      )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {/* Toolbar */}
            <div
              className="p-3 mb-4 flex items-center justify-between"
              style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="px-3 py-1.5 text-sm w-64 focus:outline-none"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                />
              </div>
              <button
                onClick={() => openUserModal()}
                className="px-3 py-1.5 text-xs font-medium flex items-center gap-2"
                style={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <UserPlus size={14} />
                Create User
              </button>
            </div>

            {/* Table */}
            <div style={{ border: `1px solid ${colors.border}` }}>
              {/* Table Header */}
              <div
                className="grid grid-cols-12 px-3 py-2"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                <div className="col-span-3 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  User
                </div>
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Department
                </div>
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Roles
                </div>
                <div className="col-span-1 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Status
                </div>
                <div className="col-span-4 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: colors.textPrimary }}>
                  Actions
                </div>
              </div>

              {/* Table Body */}
              {loadingUsers ? (
                <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                  Loading...
                </div>
              ) : paginatedUsers.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                  No users found
                </div>
              ) : (
                <div>
                  {paginatedUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 px-3 py-2.5"
                      style={{
                        backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                        borderBottom: `1px solid ${colors.border}`
                      }}
                    >
                      <div className="col-span-3">
                        <div className="text-xs font-medium" style={{ color: colors.textPrimary }}>
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs" style={{ color: colors.textMuted }}>
                          {user.designation || '-'}
                        </div>
                        <div className="text-xs" style={{ color: colors.textMuted }}>
                          {user.email}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs" style={{ color: colors.textPrimary }}>
                          {user.department || '-'}
                        </div>
                        {user.officeLocation && (
                          <div className="text-xs" style={{ color: colors.textMuted }}>
                            {user.officeLocation}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs" style={{ color: colors.textSecondary }}>
                          {user.roles.map(r => r.name).join(', ') || '-'}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-xs" style={{ color: user.isActive ? colors.primary : colors.error }}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="col-span-4 flex gap-2 justify-end">
                        <button
                          onClick={() => openRoleAssignmentModal(user)}
                          className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                          style={{ color: colors.primary }}
                        >
                          <ShieldCheck size={12} />
                          Roles
                        </button>
                        <button
                          onClick={() => openUserModal(user)}
                          className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                          style={{ color: colors.primary }}
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleSendUserDetails(user)}
                          className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                          style={{ color: colors.primary }}
                          disabled={sendingEmailFor === user.id}
                        >
                          {sendingEmailFor === user.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              <Mail size={12} />
                              Email
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2 py-0.5 text-xs hover:underline flex items-center gap-1"
                          style={{ color: colors.error }}
                          disabled={deletingUserId === user.id}
                        >
                          {deletingUserId === user.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>
                              <Trash2 size={12} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={usersPage}
                totalPages={Math.ceil(filteredUsers.length / usersPageSize)}
                totalCount={filteredUsers.length}
                pageSize={usersPageSize}
                onPageChange={setUsersPage}
                onPageSizeChange={(size) => { setUsersPageSize(size); setUsersPage(1); }}
              />
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <div>
            {/* Toolbar */}
            <div
              className="p-3 mb-4 flex items-center justify-between"
              style={{ backgroundColor: colors.bgSecondary, border: `1px solid ${colors.border}` }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search routes..."
                  className="px-3 py-1.5 text-sm w-64 focus:outline-none"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                />
              </div>
              <button
                onClick={loadRoutes}
                className="px-3 py-1.5 text-xs font-medium flex items-center gap-2"
                style={{
                  backgroundColor: colors.bgPrimary,
                  border: `1px solid ${colors.border}`,
                  color: colors.textPrimary
                }}
                disabled={loadingRoutes}
              >
                <RefreshCw size={14} className={loadingRoutes ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Table */}
            <div style={{ border: `1px solid ${colors.border}` }}>
              {/* Table Header */}
              <div
                className="grid grid-cols-12 px-3 py-2"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderBottom: `1px solid ${colors.border}`
                }}
              >
                <div className="col-span-1 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Method
                </div>
                <div className="col-span-4 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Route
                </div>
                <div className="col-span-5 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Description
                </div>
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textPrimary }}>
                  Controller
                </div>
              </div>

              {/* Table Body */}
              {loadingRoutes ? (
                <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                  Loading...
                </div>
              ) : paginatedRoutes.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: colors.textMuted }}>
                  No routes found
                </div>
              ) : (
                <div>
                  {paginatedRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 px-3 py-2.5"
                      style={{
                        backgroundColor: index % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                        borderBottom: `1px solid ${colors.border}`
                      }}
                    >
                      <div className="col-span-1">
                        <span
                          className="text-xs px-1.5 py-0.5 font-semibold"
                          style={{
                            backgroundColor: route.method === 'GET' ? '#10b981' :
                                           route.method === 'POST' ? '#3b82f6' :
                                           route.method === 'PUT' ? '#f59e0b' : '#ef4444',
                            color: 'white'
                          }}
                        >
                          {route.method}
                        </span>
                      </div>
                      <div className="col-span-4">
                        <code className="text-xs font-mono" style={{ color: colors.textPrimary }}>
                          {route.route}
                        </code>
                      </div>
                      <div className="col-span-5 text-xs" style={{ color: colors.textMuted }}>
                        {route.description}
                      </div>
                      <div className="col-span-2 text-xs" style={{ color: colors.textSecondary }}>
                        {route.controller}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <Pagination
                currentPage={routesPage}
                totalPages={Math.ceil(filteredRoutes.length / routesPageSize)}
                totalCount={filteredRoutes.length}
                pageSize={routesPageSize}
                onPageChange={setRoutesPage}
                onPageSizeChange={(size) => { setRoutesPageSize(size); setRoutesPage(1); }}
              />
            </div>
          </div>
        )}

        {/* Role Modal */}
        <Modal
          isOpen={showRoleModal}
          onClose={() => {
            setShowRoleModal(false);
            setEditingRole(null);
            setRoleFormData({ name: '', description: '', permissions: [] });
          }}
          title={editingRole ? 'Edit Role' : 'Create New Role'}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Role Name
              </label>
              <Input
                value={roleFormData.name}
                onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                placeholder="Enter role name"
                disabled={editingRole?.isSystemRole}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Description
              </label>
              <Input
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                placeholder="Enter role description"
                disabled={editingRole?.isSystemRole}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3 flex items-center gap-2" style={{ color: colors.textSecondary }}>
                <Key size={16} />
                Permissions by Feature
              </label>
              <p className="text-xs mb-3" style={{ color: colors.textMuted }}>
                Select which features this role can access. Click on a feature header to expand and see individual API endpoints.
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto p-3 rounded-lg" style={{ backgroundColor: colors.bgSecondary }}>
                {Object.entries(groupedRoutes).map(([controllerName, routes]) => {
                  const config = permissionGroupConfig[controllerName] || {
                    name: controllerName,
                    description: `Access to ${controllerName} endpoints`,
                    icon: 'folder'
                  };
                  const isExpanded = expandedGroups.has(controllerName);
                  const selectionState = getGroupSelectionState(controllerName);
                  const selectedCount = routes.filter(r =>
                    roleFormData.permissions.includes(`${r.method}:${r.route}`)
                  ).length;

                  return (
                    <div key={controllerName} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
                      {/* Group Header */}
                      <div
                        className={`p-3 flex items-center justify-between ${
                          editingRole?.isSystemRole ? 'opacity-50' : 'cursor-pointer hover:bg-opacity-80'
                        }`}
                        style={{
                          backgroundColor: selectionState !== 'none' ? colors.primaryLight : colors.bgPrimary
                        }}
                      >
                        <div
                          className="flex items-center gap-3 flex-1"
                          onClick={() => !editingRole?.isSystemRole && toggleGroup(controllerName)}
                        >
                          {isExpanded ? (
                            <ChevronDown size={18} style={{ color: colors.textMuted }} />
                          ) : (
                            <ChevronRight size={18} style={{ color: colors.textMuted }} />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium" style={{ color: colors.textPrimary }}>
                                {config.name}
                              </span>
                              <span
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor: selectionState === 'all' ? colors.primary :
                                                   selectionState === 'some' ? colors.primaryLight : colors.bgSecondary,
                                  color: selectionState === 'all' ? 'white' : colors.textMuted
                                }}
                              >
                                {selectedCount}/{routes.length}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                              {config.description}
                            </p>
                          </div>
                        </div>
                        {/* Select All Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!editingRole?.isSystemRole) {
                              toggleAllInGroup(controllerName);
                            }
                          }}
                          disabled={editingRole?.isSystemRole}
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            editingRole?.isSystemRole ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                          }`}
                          style={{
                            backgroundColor: selectionState === 'all' ? colors.primary :
                                           selectionState === 'some' ? colors.primary : colors.bgSecondary,
                            border: selectionState === 'none' ? `2px solid ${colors.border}` : 'none'
                          }}
                          title={selectionState === 'all' ? 'Deselect all' : 'Select all'}
                        >
                          {selectionState === 'all' && <Check size={14} className="text-white" />}
                          {selectionState === 'some' && <Minus size={14} className="text-white" />}
                        </button>
                      </div>

                      {/* Expanded Routes */}
                      {isExpanded && (
                        <div className="border-t" style={{ borderColor: colors.border, backgroundColor: colors.bgPrimary }}>
                          {routes.map((route) => {
                            const permissionKey = `${route.method}:${route.route}`;
                            const isSelected = roleFormData.permissions.includes(permissionKey);
                            return (
                              <div
                                key={permissionKey}
                                onClick={() => !editingRole?.isSystemRole && togglePermission(permissionKey)}
                                className={`p-2.5 pl-10 flex items-center gap-3 border-b last:border-b-0 ${
                                  editingRole?.isSystemRole ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-50'
                                }`}
                                style={{
                                  borderColor: colors.border,
                                  backgroundColor: isSelected ? `${colors.primaryLight}50` : 'transparent'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  disabled={editingRole?.isSystemRole}
                                  className="rounded"
                                  style={{ accentColor: colors.primary }}
                                />
                                <span
                                  className="text-xs px-2 py-0.5 rounded font-semibold shrink-0"
                                  style={{
                                    backgroundColor: route.method === 'GET' ? '#10b981' :
                                                   route.method === 'POST' ? '#3b82f6' :
                                                   route.method === 'PUT' ? '#f59e0b' : '#ef4444',
                                    color: 'white',
                                    minWidth: '52px',
                                    textAlign: 'center'
                                  }}
                                >
                                  {route.method}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <code className="text-xs font-mono block truncate" style={{ color: colors.textPrimary }}>
                                    {route.route}
                                  </code>
                                  <p className="text-xs truncate" style={{ color: colors.textMuted }}>
                                    {route.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
              <Button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                style={{ backgroundColor: colors.primary }}
                className="text-white hover:opacity-90 flex-1 flex items-center gap-2 justify-center"
                disabled={editingRole?.isSystemRole || savingRole}
              >
                {savingRole && <Loader2 size={16} className="animate-spin" />}
                {savingRole ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
              </Button>
              <Button
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingRole(null);
                  setRoleFormData({ name: '', description: '', permissions: [] });
                }}
                variant="outline"
                disabled={savingRole}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* User Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false);
            setEditingUser(null);
            setUserFormData(getDefaultUserFormData());
          }}
          title={editingUser ? 'Edit User' : 'Create New User'}
          size="xl"
        >
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                <UsersIcon size={16} />
                Basic Information
              </h3>
              <div className="space-y-3 pl-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                    Email
                  </label>
                  <Input
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="Enter email"
                    disabled={!!editingUser}
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                      Password
                    </label>
                    <Input
                      type="password"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                      placeholder="Enter password"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                      First Name
                    </label>
                    <Input
                      value={userFormData.firstName}
                      onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                      Last Name
                    </label>
                    <Input
                      value={userFormData.lastName}
                      onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={userFormData.phoneNumber}
                    onChange={(e) => setUserFormData({ ...userFormData, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            {/* Employee Information Section */}
            <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                <Briefcase size={16} />
                Employee Information
              </h3>
              <div className="space-y-3 pl-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <BadgeCheck size={14} />
                      Employee ID
                    </label>
                    <Input
                      value={userFormData.employeeId}
                      onChange={(e) => setUserFormData({ ...userFormData, employeeId: e.target.value })}
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <UserCog size={14} />
                      Designation
                    </label>
                    <Input
                      value={userFormData.designation}
                      onChange={(e) => setUserFormData({ ...userFormData, designation: e.target.value })}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <Building2 size={14} />
                      Department
                    </label>
                    <Input
                      value={userFormData.department}
                      onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <MapPin size={14} />
                      Office Location
                    </label>
                    <Input
                      value={userFormData.officeLocation}
                      onChange={(e) => setUserFormData({ ...userFormData, officeLocation: e.target.value })}
                      placeholder="e.g., New York, Floor 5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <Calendar size={14} />
                      Date of Joining
                    </label>
                    <Input
                      type="date"
                      value={userFormData.dateOfJoining}
                      onChange={(e) => setUserFormData({ ...userFormData, dateOfJoining: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-1.5" style={{ color: colors.textSecondary }}>
                      <UsersIcon size={14} />
                      Reports To
                    </label>
                    <select
                      value={userFormData.reportsToId}
                      onChange={(e) => setUserFormData({ ...userFormData, reportsToId: e.target.value })}
                      className="w-full px-3 py-2 text-sm focus:outline-none"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        border: `1px solid ${colors.border}`,
                        color: colors.textPrimary
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                      onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                    >
                      <option value="">Select Manager</option>
                      {users.filter(u => u.id !== editingUser?.id).map(u => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} {u.designation ? `(${u.designation})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Roles Section */}
            <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.textPrimary }}>
                <Shield size={16} />
                Status & Roles
              </h3>
              <div className="space-y-3 pl-6">
                {editingUser && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={userFormData.isActive}
                      onChange={(e) => setUserFormData({ ...userFormData, isActive: e.target.checked })}
                      className="rounded"
                      style={{ accentColor: colors.primary }}
                    />
                    <label htmlFor="isActive" className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Active User
                    </label>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Assign Roles
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {roles.map((role) => {
                      const isSelected = userFormData.roleIds.includes(role.id);
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => toggleRoleInUserForm(role.id)}
                          className="px-3 py-1.5 rounded text-sm font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: isSelected ? colors.primary : colors.bgSecondary,
                            color: isSelected ? 'white' : colors.textSecondary,
                            border: `1px solid ${isSelected ? colors.primary : colors.border}`
                          }}
                        >
                          {role.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-inherit" style={{ borderColor: colors.border, backgroundColor: colors.bgPrimary }}>
              <Button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                style={{ backgroundColor: colors.primary }}
                className="text-white hover:opacity-90 flex-1 flex items-center gap-2 justify-center"
                disabled={savingUser}
              >
                {savingUser && <Loader2 size={16} className="animate-spin" />}
                {savingUser ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
              </Button>
              <Button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                  setUserFormData(getDefaultUserFormData());
                }}
                variant="outline"
                disabled={savingUser}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

        {/* Role Assignment Modal */}
        <Modal
          isOpen={showRoleAssignmentModal}
          onClose={() => {
            setShowRoleAssignmentModal(false);
            setAssigningRolesFor(null);
            setSelectedRoleIds([]);
          }}
          title={`Assign Roles to ${assigningRolesFor?.firstName} ${assigningRolesFor?.lastName}`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => {
                const isSelected = selectedRoleIds.includes(role.id);
                return (
                  <button
                    key={role.id}
                    onClick={() => toggleRoleSelection(role.id)}
                    className="px-3 py-2 rounded text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: isSelected ? colors.primary : colors.bgSecondary,
                      color: isSelected ? 'white' : colors.textSecondary,
                      border: `1px solid ${isSelected ? colors.primary : colors.border}`
                    }}
                  >
                    {role.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
              <Button
                onClick={handleAssignRoles}
                style={{ backgroundColor: colors.primary }}
                className="text-white hover:opacity-90 flex-1 flex items-center gap-2 justify-center"
                disabled={savingRoleAssignment}
              >
                {savingRoleAssignment && <Loader2 size={16} className="animate-spin" />}
                {savingRoleAssignment ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => {
                  setShowRoleAssignmentModal(false);
                  setAssigningRolesFor(null);
                  setSelectedRoleIds([]);
                }}
                variant="outline"
                disabled={savingRoleAssignment}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
