import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  // No token → redirect to login
  if (!token) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Extract role and expiration
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const exp = payload.exp;

    // Check expiration
    if (exp * 1000 < Date.now()) {
      localStorage.clear();
      router.navigate(['/auth/admin'], {
        queryParams: { sessionExpired: true },
      });
      return false;
    }

    // Check role = Student
    if (role !== 'Admin') {
      router.navigate(['/forbidden']);
      return false;
    }

    return true; // Authorized for Student
  } catch (e) {
    // Invalid token format
    localStorage.clear();
    router.navigate(['/auth/admin']);
    return false;
  }
};
