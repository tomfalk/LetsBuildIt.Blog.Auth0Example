import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

import { Auth0Service } from './core/auth/auth0/auth0.service';
import { Auth0Interceptor } from './core/auth/auth0/auth0.interceptor';
import { Auth0Guard } from './core/auth/auth0/auth0.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,  
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent, canActivate: [Auth0Guard] },
      { path: 'auth-callback', component: AuthCallbackComponent },
    ])
  ],
  providers: [
    Auth0Service,
    Auth0Guard,
    { provide: HTTP_INTERCEPTORS, useClass: Auth0Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
