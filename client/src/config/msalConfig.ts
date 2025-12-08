import type { Configuration, PopupRequest } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '';
const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common';
const redirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI || 'http://localhost:5173';

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'email', 'profile', 'openid'],
};

export const isMicrosoftAuthEnabled = (): boolean => {
  return !!clientId && clientId.length > 0;
};
