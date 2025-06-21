import { InjectionToken } from '@angular/core';

export interface AppEnvironment {
  apiUrl: string;
  production: boolean; 
}

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('App Environment');
