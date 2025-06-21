import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const mb= new MatSnackBar()
  const router = inject(Router);

  const authReq = req.clone({
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        console.warn('401 Unauthorized - redirecting to login...');
        // Optional: clear token
        localStorage.removeItem('token');
        mb.open('Session expired. Login again!','X',{duration:3000})
      setTimeout(()=>{
        router.navigate(['/auth/login'])
      },3000)  ;
      }
      return throwError(() => error);
    })
  );
};
