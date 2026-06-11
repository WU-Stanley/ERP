import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, throwError, from, timer } from 'rxjs';
import { retry, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // Always include access token if available
  const token = authService.getAccessToken();

  // Decide if withCredentials should be applied
  const requiresCredentials =
    !req.url.includes('/auth/login') || !req.url.includes('/auth/verify');

  // Clone request accordingly
  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: requiresCredentials,
  });

  return next(authReq).pipe(
    retry(
      genericRetryStrategy({
        maxRetryAttempts: 2,
        scalingDuration: 2000,
      })
    ),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        // Attempt token refresh (avoid looping on refresh itself)
        if (!req.url.includes('/auth/refresh')) {
          return from(authService.refreshAccessToken()).pipe(
            switchMap((success) => {
              if (success) {
                const newReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${authService.getAccessToken()}`,
                  },
                  withCredentials: requiresCredentials,
                });
                return next(newReq);
              } else {
                // authService.logout();
                return throwError(() => error);
              }
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};

export function genericRetryStrategy({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [400, 403, 404], // 401 handled separately
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];
} = {}) {
  return {
    count: maxRetryAttempts,
    delay: (error: HttpErrorResponse, retryCount: number) => {
      if (excludedStatusCodes.includes(error.status)) {
        throw error;
      }
      return timer(retryCount * scalingDuration);
    },
  };
}
