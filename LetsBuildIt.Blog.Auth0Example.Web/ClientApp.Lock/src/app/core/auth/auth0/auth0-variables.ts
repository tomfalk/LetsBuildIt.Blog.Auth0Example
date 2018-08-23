interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
  audience: string;
  scope: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '9gwHtz1odGVlikcgSG3GkxmwHsVyfKg9',
  domain: 'letsbuildit.eu.auth0.com',
  callbackURL: 'http://localhost:4200',
  audience: 'https://letsbuildit.com/api',
  scope: 'openid profile email read:all'
};
