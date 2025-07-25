import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export interface RoleGuardData {
  roles: string[];
  requireAll?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['roles'] as string[];
    const requireAll = route.data['requireAll'] as boolean || false;

    if (!requiredRoles || requiredRoles.length === 0) {
      return new Observable(subscriber => {
        subscriber.next(true);
        subscriber.complete();
      });
    }

    return this.authService.authState$.pipe(
      take(1),
      map(authState => {
        if (!authState.isAuthenticated) {
          return this.router.createUrlTree(['/auth/login']);
        }

        const user = authState.user;
        if (!user) {
          return this.router.createUrlTree(['/auth/login']);
        }

        let hasAccess = false;
        if (requireAll) {
          // User must have ALL required roles
          hasAccess = requiredRoles.every(role => user.roles.includes(role));
        } else {
          // User must have AT LEAST ONE required role
          hasAccess = requiredRoles.some(role => user.roles.includes(role));
        }

        if (hasAccess) {
          return true;
        } else {
          // Redirect to access denied page
          return this.router.createUrlTree(['/auth/access-denied']);
        }
      })
    );
  }
} 