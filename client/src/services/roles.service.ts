import { api } from './api';

export interface Permission {
  id: string;
  route: string;
  method: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  permissions?: Permission[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions?: string[]; // Array of permission route patterns
}

export interface UpdateRoleRequest {
  name: string;
  description: string;
  permissions?: string[]; // Array of permission route patterns
}

class RolesService {
  async getAllRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  }

  async getRoleById(id: string): Promise<Role> {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  }

  async createRole(data: CreateRoleRequest): Promise<Role> {
    const response = await api.post<Role>('/roles', data);
    return response.data;
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
    const response = await api.put<Role>(`/roles/${id}`, data);
    return response.data;
  }

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }
}

export const rolesService = new RolesService();
