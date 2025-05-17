import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    const userRol = this.authService.getRol();
    const expectedRoles = route.data['roles'] as string[];

    console.log('AuthGuard: Evaluando ruta', {
      url: state.url,
      isAuthenticated,
      userRol,
      expectedRoles,
      routeData: route.data
    });

    if (isAuthenticated && userRol && expectedRoles?.includes(userRol)) {
      return true;
    }

    console.log('AuthGuard: Acceso denegado', { isAuthenticated, userRol, expectedRoles });
    this.router.navigate(['/auth/login']);
    return false;
  }
}
