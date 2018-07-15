import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@fuse/services/partials/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    /* Try to auth with the server. If authed resolve to true, else resolve to false */
    return this.auth
      .authenticate()
      .then((e) => true)
      .catch(() => {
        this.router.navigate(['/auth/login']);
        return false;
      });
  }
}
