import { Injectable, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Auth0Service } from './auth0.service';

@Injectable()
export class Auth0Interceptor implements HttpInterceptor {
  constructor(
    private inj: Injector,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log("Intercepting http request");
    // Get the auth header from the service.
    const auth = this.inj.get(Auth0Service);

    // Clone the request to add the new header.
    let headers = req.headers;
    if (isPlatformBrowser(this.platformId)) {
      //console.log("Adding auth token...");
      headers = req.headers.set('Authorization', 'Bearer ' + auth.accessToken);
    }

    const authReq = req.clone({ headers });
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
