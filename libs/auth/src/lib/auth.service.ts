import { HttpBackend, HttpClient, HttpRequest } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { Subscription, timer } from 'rxjs';
// Update the import path to the correct relative path for your environment file
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  refToken = signal('');
  tokenExpires = signal(0);
  private refreshSubscription?: Subscription;

  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor( private router: Router) { 
  }
  login(formValue: { email: string; password: string }) {
    return this.http.post(this.env.apiUrl + '/auth/login', formValue);
  }
  verifyLoginToken(value: any) {
    return this.http.post<any>(
      this.env.apiUrl + '/auth/verify-login-token',
      value
    );
  }
  changePassword(json: any) {
    return this.http.post(this.env.apiUrl + '/auth/change-password', json);
  }
  getTokenExpiration(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      return 0;
    }
     try {
      const payload = JSON.parse(atob(token.split('.')[1]));
       
      const exp= payload.exp * 1000; // convert to milliseconds
     console.log('exp: ',exp);
     return exp; } catch (e) {
      console.error('Invalid token format');
      return Date.now();
    }
  }
 
  scheduleTokenRefresh() { 
      this.clearRefreshTimer();
const now = Date.now();
const expiration= this.getTokenExpiration();
    const refreshIn = expiration - now - 60_000; // refresh 1 minute before expiry

    if (refreshIn <= 0) {
      console.warn('Token already expired or near expiry, refreshing now...');
      this.refreshToken();
      return;
    }

      this.refreshSubscription = timer(expiration).subscribe(
        () => {
          this.refreshToken();
        }
      );
    
  }
  setEnv(tokenRes: any) {
    localStorage.setItem('token', tokenRes.token);
    localStorage.setItem('user', JSON.stringify(tokenRes.data));
    localStorage.setItem('refToken', tokenRes.refreshToken);
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refToken');
    if (!refreshToken) {
      this.logout();
      return;
    }

    this.http
      .post(this.env.apiUrl + '/auth/refresh-token', {
        refreshToken: refreshToken,
      })
      .subscribe({
        next: (res: any) => {
          console.log('setting new tokens: ', res);
          this.setEnv(res);
          this.scheduleTokenRefresh(); // ⏰ Reschedule
        },
        error: () => {
          this.logout();
        },
      });
  }

  logout() {console.log('logout clicked')
    this.clearRefreshTimer();
    localStorage.removeItem('token');
    localStorage.removeItem('refToken');
    this.router.navigate(['/auth/login']);
  }

  clearRefreshTimer() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
