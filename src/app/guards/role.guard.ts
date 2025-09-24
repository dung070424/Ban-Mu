import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredPermission = route.data['permission'] as string;
    const requiredRole = route.data['role'] as string;

    if (!this.authService.getIsAuthenticated()()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    // Check by permission
    if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    // Check by role
    if (requiredRole) {
      const userRole = this.authService.userRole();
      if (userRole !== requiredRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
