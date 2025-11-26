import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { ApiResponse } from './ApiResponse';
import { User } from './dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  user = signal<User | null>(null);
  refToken = signal('');
  private refreshSubscription?: Subscription;

  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}

  async refreshAccessToken(): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(
          this.env.apiUrl + '/auth/refresh-token',
          {},
          { withCredentials: true }
        )
      );
      console.log('access token: ', response);
      this.setAccessToken(response.token);
      return true;
    } catch (error) {
      this.clearAccessToken();
      return false;
    }
  }
  clearAccessToken() {
    this.accessToken = null;
  }
  setAccessToken(token: string) {
    this.accessToken = token;
  }
  getAccessToken(): string | null {
    return this.accessToken ?? localStorage.getItem('token');
  }
  loginStudent(formValue: { email: string; password: string }) {
    return this.http.post<any>(
      this.env.apiUrl + '/auth/login/student',
      formValue,
      { withCredentials: false }
    );
  }
  vendorLogin(value: { email: string; password: string }) {
    return this.http.post<any>(this.env.apiUrl + '/auth/login/vendor', value, {
      withCredentials: false,
    });
  }
  logout() {
    console.log('logout clicked');
    this.http.post(this.env.apiUrl + '/auth/logout', {}).subscribe((res) => {
      this.clearRefreshTimer();
      localStorage.removeItem('token');
      localStorage.removeItem('refToken');
      this.router.navigate(['/auth/login']);
    });
    this.clearRefreshTimer();
    localStorage.clear();
    this.router.navigate(['/auth/login']);
    document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  clearRefreshTimer() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
