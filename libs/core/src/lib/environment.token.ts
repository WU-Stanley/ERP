import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  apiUrl: string;
  production: boolean;
  microsoftAuth?: {
    tenantId: string;
    clientId: string;
    redirectUri: string;
  };
}

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('App Environment');
