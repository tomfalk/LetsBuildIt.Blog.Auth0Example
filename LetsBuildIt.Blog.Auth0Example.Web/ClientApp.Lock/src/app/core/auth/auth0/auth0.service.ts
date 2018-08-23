import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AUTH_CONFIG } from './auth0-variables';

@Injectable()
export class Auth0Service {
  // Create Auth0 web auth instance
  private lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    autoclose: true,
    allowAutocomplete: true,
    avatar: null,
    configurationBaseUrl: 'https://cdn.eu.auth0.com',
    auth: {
      // Set redirect to 'false' to use Lock without redirection after login
      redirect: true,
      redirectUrl: AUTH_CONFIG.callbackURL,
      responseType: 'token id_token',
      audience: AUTH_CONFIG.audience,
      params: {
        scope: AUTH_CONFIG.scope
      }
    }
  });

  accessToken: string;
  userProfile: any;
  expiresAt: number;
  isAdmin: boolean;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  loggingIn: boolean;
  // Subscribe to token expiration stream
  refreshSub: Subscription;
  routeSub: Subscription;

  constructor(private router: Router) {
    // If app auth token is not expired, request new token
    if (JSON.parse(localStorage.getItem('expires_at')) > Date.now()) {
      this.renewToken();
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status behavior subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    this.lock.show();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.lock.on('authenticated', (authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this._getProfile(authResult);
      }
      else {
          this._clearRedirect();
          this.router.navigate(['/']);
          console.error('Error authenticating');
      }
    });
  }

  private _getProfile(authResult) {
    this.loggingIn = true;
    // Use access token to retrieve user's profile and set session
    this.lock.getUserInfo(authResult.accessToken, (err, profile) => {
      if (profile) {
        this._setSession(authResult, profile);
        try {
          if (localStorage.getItem('authRedirect')) {
            console.log("Calling redirect");
            this._redirect();
          }
        } catch (e) {
          console.log("REDIRECT ERROR!");
          console.log(e);
        }
      } else if (err) {
        console.warn(`Error retrieving profile: ${err.error}`);
      }
    });
  }

  private _setSession(authResult, profile?) {
    this.expiresAt = (authResult.expiresIn * 1000) + Date.now();
    // Store expiration in local storage to access in constructor
    localStorage.setItem('expires_at', JSON.stringify(this.expiresAt));
    this.accessToken = authResult.accessToken;
    // If initial login, set profile and admin information
    if (profile) {
      this.userProfile = profile;
      //this.isAdmin = this._checkAdmin(profile);
    }
    // Update login status in loggedIn$ stream
    this.setLoggedIn(true);
    this.loggingIn = false;
    // Schedule access token renewal
    this.scheduleRenewal();
  }

  // Note - this example is not using roles
  private _checkAdmin(profile) {
    // Check if the user has admin role
    //const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    //return roles.indexOf('admin') > -1;
  }

  private _redirect() {
    // Redirect with or without 'tab' query parameter
    // Note: does not support additional params besides 'tab'
    const fullRedirect = decodeURI(localStorage.getItem('authRedirect'));
    console.log("Full redirect: " + fullRedirect);

    const redirectArr = fullRedirect.split('?tab=');
    const navArr = [redirectArr[0] || '/'];
    const tabObj = redirectArr[1] ? { queryParams: { tab: redirectArr[1] } } : null;

    if (!tabObj) {
      this.router.navigate(navArr);
    } else {
      this.router.navigate(navArr, tabObj);
    }
    // Redirection completed; clear redirect from storage
    this._clearRedirect();
    //throw new Error('Something bad happened');
  }

  private _clearRedirect() {
    // Remove redirect from localStorage
    localStorage.removeItem('authRedirect');
  }

  private _clearExpiration() {
    // Remove token expiration from localStorage
    localStorage.removeItem('expires_at');
  }

  logout() {
    // Remove data from localStorage
    this._clearExpiration();
    this._clearRedirect();
    // End Auth0 authentication session
    this.lock.logout({
      returnTo: 'http://localhost:4200'
    });
  }

  get tokenValid(): boolean {
    // Check if current time is past access token's expiration
    return Date.now() < JSON.parse(localStorage.getItem('expires_at'));
  }

  renewToken() {
    // Check for valid Auth0 session
    this.lock.checkSession({
      audience: AUTH_CONFIG.audience,
      scope: AUTH_CONFIG.scope
    }, (err, authResult) => {
      if (authResult && authResult.accessToken) {
        console.log("Token renewed successfully");
        this._getProfile(authResult);
      } else {
        console.log("Token renew failed");
        this._clearExpiration();
      }
    });
  }

  scheduleRenewal() {
    // If last token is expired, do nothing
    if (!this.tokenValid) { return; }
    // Unsubscribe from previous expiration observable
    this.unscheduleRenewal();
    // Create and subscribe to expiration observable
    const expiresIn$ = of(this.expiresAt).pipe(
      mergeMap(
        expires => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return timer(Math.max(1, expires - now));
        }
      )
    );

    this.refreshSub = expiresIn$
      .subscribe(
        () => {
          this.renewToken();
          this.scheduleRenewal();
        }
      );
  }

  unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

}
