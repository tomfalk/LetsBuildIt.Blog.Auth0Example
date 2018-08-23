interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
  //NAMESPACE: string;
};

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '9gwHtz1odGVlikcgSG3GkxmwHsVyfKg9',
  CLIENT_DOMAIN: 'letsbuildit.eu.auth0.com',
  AUDIENCE: 'https://letsbuildit.com/api',
  REDIRECT: 'http://localhost:4200/auth-callback',
  SCOPE: 'openid profile email read:all'
  //NAMESPACE: 'http://myapp.com/roles'
};
