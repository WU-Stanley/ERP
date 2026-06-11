import {
  ApplicationConfig,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT } from '@erp/core';
import { environment } from '../environments/environment';
import { AuthInterceptor } from '@erp/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
