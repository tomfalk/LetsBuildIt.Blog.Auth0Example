import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Service } from '../core/auth/auth0/auth0.service';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(private authService: Auth0Service, protected readonly router: Router) {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  public login() {
    localStorage.setItem('authRedirect', this.router.url);
    this.authService.login();
  }

  public logout() {
    this.authService.logout();
    //this.router.navigateByUrl('');
  }
}
