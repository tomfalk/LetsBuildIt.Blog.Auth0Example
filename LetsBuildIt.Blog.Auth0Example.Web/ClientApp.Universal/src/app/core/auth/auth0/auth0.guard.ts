// angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';

// module
import { Auth0Service } from './auth0.service';

@Injectable()
export class Auth0Guard implements CanActivate, CanActivateChild {
  constructor(
              private readonly auth: Auth0Service,
              private readonly router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.loggedIn) {
      localStorage.setItem('authRedirect', state.url);
    }
    if (!this.auth.tokenValid && !this.auth.loggedIn) {
      this.auth.login();
      return false;
    }
    if (this.auth.tokenValid && this.auth.loggedIn) {
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

}
