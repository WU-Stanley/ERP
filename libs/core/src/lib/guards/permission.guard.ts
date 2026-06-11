import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const requiredPermissions: string[] = route.data['permissions'] || [];

    if (this.authService.hasAnyPermission(requiredPermissions)) {
      return true;
    }

    // Optionally redirect unauthorized users
    this.router.navigate(['/unauthorized'], {
      queryParams: { returnUrl: state.url },
    });

    return false;
  }
}
