import { api } from './api';
import type { Role } from './roles.service';

export interface UserWithRoles {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  roles: Role[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface AssignRolesRequest {
  roleIds: string[];
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
}

export const usersService = new UsersService();
