import { api } from './api';
import type { Role } from './roles.service';

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  avatarColor?: string | null;
  isActive: boolean;

  // Enterprise/Employee Information
  employeeId?: string | null;
  designation?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  officeLocation?: string | null;
  dateOfJoining?: string | null;
  reportsToId?: string | null;
  reportsToName?: string | null;

  createdAt: string;
  roles: Role[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  // Enterprise/Employee Information
  employeeId?: string | null;
  designation?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  officeLocation?: string | null;
  dateOfJoining?: string | null;
  reportsToId?: string | null;

  roleIds: string[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  isActive: boolean;

  // Enterprise/Employee Information
  employeeId?: string | null;
  designation?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  officeLocation?: string | null;
  dateOfJoining?: string | null;
  reportsToId?: string | null;
}

export interface AssignRolesRequest {
  roleIds: string[];
}

export interface UpdateAvatarRequest {
  avatarUrl: string | null;
  avatarColor: string | null;
}

class UsersService {
  async getAllUsers(): Promise<UserWithRoles[]> {
    const response = await api.get<UserWithRoles[]>('/users');
    return response.data;
  }

  async getUserById(id: string): Promise<UserWithRoles> {
    const response = await api.get<UserWithRoles>(`/users/${id}`);
    return response.data;
  }

  async createUser(data: CreateUserRequest): Promise<UserWithRoles> {
    const response = await api.post<UserWithRoles>('/users', data);
    return response.data;
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserWithRoles> {
    const response = await api.put<UserWithRoles>(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  async assignRoles(userId: string, data: AssignRolesRequest): Promise<UserWithRoles> {
    const response = await api.post<UserWithRoles>(`/users/${userId}/roles`, data);
    return response.data;
  }

  async updateAvatar(userId: string, data: UpdateAvatarRequest): Promise<UserWithRoles> {
    const response = await api.put<UserWithRoles>(`/users/${userId}/avatar`, data);
    return response.data;
  }

  async sendUserDetails(userId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/users/${userId}/send-details`);
    return response.data;
  }
}

export const usersService = new UsersService();
