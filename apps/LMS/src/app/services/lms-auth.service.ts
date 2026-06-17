import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: 'password' | 'microsoft';
}

export interface AuthResponse {
  token: string;
  data: AuthUser;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LmsAuthService {
  private readonly http = inject(HttpClient);

  loginWithEmail(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<ApiResponse<AuthResponse>>('/api/auth/login', payload, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  loginWithMicrosoftToken(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      '/api/auth/microsoft/login',
      { idToken },
      { withCredentials: true }
    );
  }

  startMicrosoftLogin(): void {
    window.location.assign('/api/auth/microsoft/start');
  }

  completeMicrosoftCallbackFromUrl(): boolean {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      return false;
    }

    localStorage.setItem('token', token);
    const cleanUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, document.title, cleanUrl);
    return true;
  }

  setSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
}
