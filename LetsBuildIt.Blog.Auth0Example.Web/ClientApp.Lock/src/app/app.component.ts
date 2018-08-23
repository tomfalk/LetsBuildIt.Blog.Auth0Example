import { Component } from '@angular/core';
import { Auth0Service } from './core/auth/auth0/auth0.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(public auth: Auth0Service) {
    // Comment out this method call if using
    // hash-based routing
    auth.handleAuth();

    // Uncomment this method call if using
    // hash-based routing
    // auth.handleAuthenticationWithHash();
  }
}
