import { api } from './api';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { rememberMe, ...loginData } = credentials;
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    this.storeAuthData(response.data, rememberMe);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.storeAuthData(response.data, true); // Default to remember for new registrations
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      // Call backend to trigger logout email alert
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Failed to send logout notification:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getStoredUser(): User | null {
    const userStr = this.getFromStorage('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private getAccessToken(): string | null {
    return this.getFromStorage('accessToken');
  }

  private getFromStorage(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  private storeAuthData(authData: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('accessToken', authData.accessToken);
    storage.setItem('refreshToken', authData.refreshToken);
    storage.setItem('user', JSON.stringify(authData.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }
}

export const authService = new AuthService();
