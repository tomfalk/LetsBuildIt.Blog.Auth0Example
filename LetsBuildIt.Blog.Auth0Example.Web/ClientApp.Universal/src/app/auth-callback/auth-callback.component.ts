import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../core/auth/auth0/auth0.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authService: Auth0Service, private router: Router) { }

  ngOnInit() {

    this.authService.handleAuth();
    
  }

}
