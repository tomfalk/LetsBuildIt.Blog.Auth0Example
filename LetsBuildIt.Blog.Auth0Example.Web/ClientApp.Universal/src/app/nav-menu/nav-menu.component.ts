import { Component } from '@angular/core';
import { Auth0Service } from '../core/auth/auth0/auth0.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private auth0Service: Auth0Service, protected readonly router: Router) {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public login() {
    localStorage.setItem('authRedirect', this.router.url);
    this.auth0Service.login();
  }

  public logout() {
    this.auth0Service.logout();
    //this.router.navigateByUrl('');
  }
}
