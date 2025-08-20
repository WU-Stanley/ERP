import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  from,
  switchMap,
  throwError,
  retry,
  timer,
} from 'rxjs';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<boolean>(false);

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();
  const clonedReq = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isRefreshing
      ) {
        isRefreshing = true;
        refreshSubject.next(false);

        return from(authService.refreshAccessToken()).pipe(
          switchMap((success) => {
            isRefreshing = false;
            if (success) {
              refreshSubject.next(true);
              const newToken = authService.getAccessToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(retryReq).pipe(
                retry({
                  count: 3,
                  delay: retryDelay,
                })
              );
            } else {
              return throwError(() => {
                // console.log('Error => ',error);
                authService.logout();
                return error;
              });
            }
          })
        );
      } else {
        return throwError(() => error);
      }
    }),
    retry({
      count: 3,
      delay: retryDelay,
    })
  );
};

function retryDelay(error: any, retryCount: number) {
  if (error instanceof HttpErrorResponse && error.status === 401) {
    throw error;
  }
  return timer(retryCount * 1000); // linear backoff
}
