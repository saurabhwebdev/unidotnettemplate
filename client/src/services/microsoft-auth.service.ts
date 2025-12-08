import { PublicClientApplication } from '@azure/msal-browser';
import type { AccountInfo } from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/msalConfig';
import { api } from './api';
import type { AuthResponse } from './auth.service';

class MicrosoftAuthService {
  private msalInstance: PublicClientApplication | null = null;

  async initialize(): Promise<void> {
    if (!this.msalInstance) {
      this.msalInstance = new PublicClientApplication(msalConfig);
      await this.msalInstance.initialize();
    }
  }

  async loginPopup(): Promise<AuthResponse> {
    await this.initialize();

    if (!this.msalInstance) {
      throw new Error('MSAL not initialized');
    }

    const loginResponse = await this.msalInstance.loginPopup(loginRequest);

    if (!loginResponse.account) {
      throw new Error('No account info returned from Microsoft');
    }

    const email = loginResponse.account.username;
    const name = loginResponse.account.name || '';
    const accessToken = loginResponse.accessToken;

    const response = await api.post<AuthResponse>('/auth/microsoft-login', {
      accessToken,
      email,
      name,
    });

    this.storeAuthData(response.data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.initialize();

    if (this.msalInstance) {
      const account = this.msalInstance.getAllAccounts()[0];
      if (account) {
        await this.msalInstance.logoutPopup({ account });
      }
    }
  }

  getAllAccounts(): AccountInfo[] {
    return this.msalInstance?.getAllAccounts() || [];
  }

  private storeAuthData(authData: AuthResponse): void {
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }
}

export const microsoftAuthService = new MicrosoftAuthService();
