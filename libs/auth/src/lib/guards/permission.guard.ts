import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const required = route.data['permission'] as string[];
    if (this.auth.hasAnyPermission(required)) return true;

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
