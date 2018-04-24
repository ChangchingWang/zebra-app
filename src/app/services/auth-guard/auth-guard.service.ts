import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

constructor(protected router: Router, protected authService: AuthService) { }

  canActivate(route, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}

