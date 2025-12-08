import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Modal } from '../components/ui/modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { SkeletonTable } from '../components/ui/skeleton';
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
} from 'lucide-react';

export function RolesAndUsers() {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'routes'>('roles');
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [availableRoutes, setAvailableRoutes] = useState<ApiRoute[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

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
    roleIds: [] as string[]
  });

  // Role assignment modal state
  const [showRoleAssignmentModal, setShowRoleAssignmentModal] = useState(false);
  const [assigningRolesFor, setAssigningRolesFor] = useState<UserWithRoles | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

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
    try {
      await rolesService.createRole(roleFormData);
      setRoleFormData({ name: '', description: '', permissions: [] });
      setShowRoleModal(false);
      loadRoles();
    } catch (error) {
      console.error('Failed to create role:', error);
      alert('Failed to create role');
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      await rolesService.updateRole(editingRole.id, roleFormData);
      setRoleFormData({ name: '', description: '', permissions: [] });
      setEditingRole(null);
      setShowRoleModal(false);
      loadRoles();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await rolesService.deleteRole(id);
      loadRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      alert('Failed to delete role');
    }
  };

  const handleCreateUser = async () => {
    try {
      const createData: CreateUserRequest = {
        email: userFormData.email,
        password: userFormData.password,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        roleIds: userFormData.roleIds
      };
      await usersService.createUser(createData);
      setUserFormData({ email: '', password: '', firstName: '', lastName: '', isActive: true, roleIds: [] });
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const updateData: UpdateUserRequest = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        isActive: userFormData.isActive
      };
      await usersService.updateUser(editingUser.id, updateData);
      setUserFormData({ email: '', password: '', firstName: '', lastName: '', isActive: true, roleIds: [] });
      setEditingUser(null);
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersService.deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const handleAssignRoles = async () => {
    if (!assigningRolesFor) return;
    try {
      await usersService.assignRoles(assigningRolesFor.id, { roleIds: selectedRoleIds });
      setAssigningRolesFor(null);
      setSelectedRoleIds([]);
      setShowRoleAssignmentModal(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to assign roles:', error);
      alert('Failed to assign roles');
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
        roleIds: user.roles.map(r => r.id)
      });
    } else {
      setEditingUser(null);
      setUserFormData({ email: '', password: '', firstName: '', lastName: '', isActive: true, roleIds: [] });
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

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoutes = availableRoutes.filter(route =>
    route.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header with Tabs */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 border-b w-full sm:w-auto" style={{ borderColor: colors.border }}>
            <button
              onClick={() => setActiveTab('roles')}
              className="flex items-center gap-2 px-4 py-3 font-medium transition-all group"
              style={{
                color: activeTab === 'roles' ? colors.primary : colors.textMuted,
                borderBottom: activeTab === 'roles' ? `2px solid ${colors.primary}` : '2px solid transparent'
              }}
            >
              <Shield size={18} className="group-hover:scale-110 transition-transform" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2 px-4 py-3 font-medium transition-all group"
              style={{
                color: activeTab === 'users' ? colors.primary : colors.textMuted,
                borderBottom: activeTab === 'users' ? `2px solid ${colors.primary}` : '2px solid transparent'
              }}
            >
              <UsersIcon size={18} className="group-hover:scale-110 transition-transform" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('routes')}
              className="flex items-center gap-2 px-4 py-3 font-medium transition-all group"
              style={{
                color: activeTab === 'routes' ? colors.primary : colors.textMuted,
                borderBottom: activeTab === 'routes' ? `2px solid ${colors.primary}` : '2px solid transparent'
              }}
            >
              <RouteIcon size={18} className="group-hover:scale-110 transition-transform" />
              Routes
            </button>
          </div>
        </div>

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                    <Shield size={24} />
                    Role Management
                  </CardTitle>
                  <CardDescription style={{ color: colors.textMuted }}>
                    Manage roles and their permissions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search roles..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    onClick={() => openRoleModal()}
                    style={{ backgroundColor: colors.primary }}
                    className="text-white hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Create Role
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRoles ? (
                <SkeletonTable />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                    <TableRow key={role.id} className="hover:bg-opacity-50">
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <Shield size={16} style={{ color: colors.primary }} />
                          {role.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.textMuted }}>{role.description}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                          {role.permissions?.length || 0} permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        {role.isSystemRole && (
                          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                            System
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={() => openRoleModal(role)}
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-transform flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </Button>
                          {!role.isSystemRole && (
                            <Button
                              onClick={() => handleDeleteRole(role.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:scale-105 transition-transform flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                    <UsersIcon size={24} />
                    User Management
                  </CardTitle>
                  <CardDescription style={{ color: colors.textMuted }}>
                    Manage users and their role assignments
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    onClick={() => openUserModal()}
                    style={{ backgroundColor: colors.primary }}
                    className="text-white hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <UserPlus size={18} />
                    Create User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <SkeletonTable />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-opacity-50">
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ backgroundColor: colors.primary }}
                          >
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" style={{ color: colors.textMuted }}>
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="text-xs px-2 py-1 rounded"
                              style={{ backgroundColor: colors.primaryLight, color: colors.primary }}
                            >
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 size={14} />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-600">
                            <XCircle size={14} />
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            onClick={() => openRoleAssignmentModal(user)}
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-transform flex items-center gap-1"
                          >
                            <ShieldCheck size={14} />
                            Roles
                          </Button>
                          <Button
                            onClick={() => openUserModal(user)}
                            variant="outline"
                            size="sm"
                            className="hover:scale-105 transition-transform flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:scale-105 transition-transform flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Routes Tab */}
        {activeTab === 'routes' && (
          <Card style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border }}>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.textPrimary }}>
                    <RouteIcon size={24} />
                    API Routes
                  </CardTitle>
                  <CardDescription style={{ color: colors.textMuted }}>
                    All available API routes in the system
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: colors.textMuted }}
                    />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search routes..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button
                    onClick={loadRoutes}
                    variant="outline"
                    className="hover:scale-105 transition-all flex items-center gap-2"
                    disabled={loadingRoutes}
                  >
                    <RefreshCw size={18} className={loadingRoutes ? 'animate-spin' : ''} />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRoutes ? (
                <SkeletonTable />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Controller</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoutes.map((route, index) => (
                    <TableRow key={index} className="hover:bg-opacity-50">
                      <TableCell>
                        <span
                          className="text-xs px-2 py-1 rounded font-semibold"
                          style={{
                            backgroundColor: route.method === 'GET' ? '#10b981' :
                                           route.method === 'POST' ? '#3b82f6' :
                                           route.method === 'PUT' ? '#f59e0b' : '#ef4444',
                            color: 'white'
                          }}
                        >
                          {route.method}
                        </span>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                          {route.route}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: colors.textMuted }}>{route.description}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: colors.primaryLight, color: colors.primary }}>
                          {route.controller}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
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
                Permissions (Routes & Methods)
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto p-3 rounded-lg" style={{ backgroundColor: colors.bgSecondary }}>
                {availableRoutes.map((route) => {
                  const permissionKey = `${route.method}:${route.route}`;
                  const isSelected = roleFormData.permissions.includes(permissionKey);
                  return (
                    <div
                      key={permissionKey}
                      onClick={() => !editingRole?.isSystemRole && togglePermission(permissionKey)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        editingRole?.isSystemRole ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
                      }`}
                      style={{
                        backgroundColor: isSelected ? colors.primaryLight : colors.bgPrimary,
                        border: `1px solid ${isSelected ? colors.primary : colors.border}`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            disabled={editingRole?.isSystemRole}
                            className="rounded"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs px-2 py-1 rounded font-semibold"
                                style={{
                                  backgroundColor: route.method === 'GET' ? '#10b981' :
                                                 route.method === 'POST' ? '#3b82f6' :
                                                 route.method === 'PUT' ? '#f59e0b' : '#ef4444',
                                  color: 'white'
                                }}
                              >
                                {route.method}
                              </span>
                              <code className="text-sm font-mono" style={{ color: colors.textPrimary }}>
                                {route.route}
                              </code>
                            </div>
                            <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                              {route.description}
                            </p>
                          </div>
                        </div>
                      </div>
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
                disabled={editingRole?.isSystemRole}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </Button>
              <Button
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingRole(null);
                  setRoleFormData({ name: '', description: '', permissions: [] });
                }}
                variant="outline"
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
            setUserFormData({ email: '', password: '', firstName: '', lastName: '', isActive: true, roleIds: [] });
          }}
          title={editingUser ? 'Edit User' : 'Create New User'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
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
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  First Name
                </label>
                <Input
                  value={userFormData.firstName}
                  onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                  Last Name
                </label>
                <Input
                  value={userFormData.lastName}
                  onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            {editingUser && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={userFormData.isActive}
                  onChange={(e) => setUserFormData({ ...userFormData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Active
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
            </div>
            <div className="flex gap-2 pt-4 border-t" style={{ borderColor: colors.border }}>
              <Button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                style={{ backgroundColor: colors.primary }}
                className="text-white hover:opacity-90 flex-1"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
              <Button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                  setUserFormData({ email: '', password: '', firstName: '', lastName: '', isActive: true, roleIds: [] });
                }}
                variant="outline"
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
                className="text-white hover:opacity-90 flex-1"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => {
                  setShowRoleAssignmentModal(false);
                  setAssigningRolesFor(null);
                  setSelectedRoleIds([]);
                }}
                variant="outline"
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
