import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppEnvironment, ENVIRONMENT } from '@erp/core';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { UserDto, UserTypeDto } from './dtos/usertype.dto';
import { CreateStaffDto } from './dtos/CreateStaff.dto';
import { ApiResponse } from './dtos/api.response';
import { UserPermissionDto } from './dtos/permission.dto';
import { User } from './dtos/user.dto';
import { UserRole } from './dtos/user-roles.dto';
import { RoleDto } from './dtos/role.dto';
import { Permissions } from './enums/permissions.enum';
// Update the import path to the correct relative path for your environment file
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;
  user = signal<User | null>(null);
  refToken = signal('');
  tokenExpires = signal(0);
  private refreshSubscription?: Subscription;

  private http = inject(HttpClient);
  private env = inject<AppEnvironment>(ENVIRONMENT);
  constructor(private router: Router) {}
 
  login(formValue: { email: string; password: string }) {
    return this.http.post<ApiResponse<{ token: string; data: User; refreshToken: string }>>(this.env.apiUrl + '/auth/login', formValue);
  }
  verifyLoginToken(value: { token: string }) {
    return this.http.post<ApiResponse<{ valid: boolean }>>(
      this.env.apiUrl + '/auth/verify-login-token',
      value
    );
  }
  assignRoleToUser(value: { userId: string; roleId: string }) {
    return this.http.post<ApiResponse<unknown>>(this.env.apiUrl + `/Role/assign/${value.userId}/${value.roleId}`, value);
  }
  removeRoleFromUser(selectedStaffId: string, roleId: string) {
    return this.http.delete<ApiResponse<unknown>>(this.env.apiUrl + `/Role/remove/${selectedStaffId}/${roleId}`);
  }
  getUserRoles(selectedStaffId: string) {
    return this.http.get<RoleDto[]>(this.env.apiUrl + '/Role/user/' + selectedStaffId);
  }
  getPermissions() {
    return this.http.get<ApiResponse<UserPermissionDto[]>>(this.env.apiUrl + "/Permission");
  }
  getUserTypes() {
    return this.http.get<{
      Message: string;
      Status: boolean;
      data: Array<UserTypeDto>;
    }>(this.env.apiUrl + '/auth/get-user-type');
  }
  getAllStaff() {
    return this.http.get<ApiResponse<UserDto[]>>(this.env.apiUrl + '/auth/users');
  }
  changePassword(json: { oldPassword: string; newPassword: string }) {
    return this.http.post<ApiResponse<unknown>>(this.env.apiUrl + '/auth/change-password', json);
  }
  getTokenExpiration(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      return 0;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const exp = payload.exp * 1000; // convert to milliseconds
      console.log('exp: ', exp);
      return exp;
    } catch (e) {
      console.error('Invalid token format');
      return Date.now();
    }
  }

  scheduleTokenRefresh() {
    this.clearRefreshTimer();
    const now = Date.now();
    const expiration = this.getTokenExpiration();
    const refreshIn = expiration - now - 60_000; // refresh 1 minute before expiry

    if (refreshIn <= 0) {
      console.warn('Token already expired or near expiry, refreshing now...');
      this.refreshToken();
      return;
    }

    this.refreshSubscription = timer(expiration).subscribe(() => {
      this.refreshToken();
    });
  }

  addStaff(value: CreateStaffDto) {
    return this.http.post<object>(this.env.apiUrl+'/auth/register',value)
  }
  setEnv(tokenRes: any) {
    localStorage.setItem('token', tokenRes.token);
    localStorage.setItem('user', JSON.stringify(tokenRes.data));
    localStorage.setItem('refToken', tokenRes.refreshToken);
    this.user.set(tokenRes.data);
  }
   setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
  }
  async refreshAccessToken(): Promise<boolean> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(this.env.apiUrl + '/auth/refresh-token', {}, { withCredentials: true })
      );
      this.setAccessToken(response.token);
      return true;
    } catch (error) {
      this.clearAccessToken();
      return false;
    }
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refToken');
    if (!refreshToken) {
      this.logout();
      return;
    }

    this.http
      .post<{ token: string; data: User; refreshToken: string }>(this.env.apiUrl + '/auth/refresh-token', {
        refreshToken: refreshToken,
      })
      .subscribe({
        next: (res) => {
          console.log('setting new tokens: ', res);
          this.setEnv(res);
          this.scheduleTokenRefresh(); // ⏰ Reschedule
        },
        error: () => {
          this.logout();
        },
      });
  }

  logout() {
    console.log('logout clicked');
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
    hasRole(role: string) {
             return this.user()?.userRoles?.find(a =>a.role.name.includes(role));
    }
 hasAnyPermission(permissions: string[]): boolean {
  const storedUser = localStorage.getItem('user');
  const user: User | null = this.user() ?? (storedUser ? JSON.parse(storedUser) : null);

  if (!user || !user.userPermissions?.length) {
    return false;
  }

  const userPerms = user.userPermissions
    .map(up => up.permission?.name?.toLowerCase() || '')
    .filter(p => !!p); // filter out empty

  const hasMatch = permissions.some(required =>
    userPerms.includes(required.toLowerCase() ||userPerms.includes(Permissions.AdminAccess))
  );

  console.log('Checking permissions:', {
    requested: permissions,
    userPermissions: userPerms,
    result: hasMatch
  });

  return hasMatch;
}


}
