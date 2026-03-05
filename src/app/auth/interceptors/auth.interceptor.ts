import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

// This runs before EVERY http request and adds the token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Don't add token to login or register requests
  const isAuthRoute = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');

  if (isAuthRoute) {
    return next(req);
  }

  const token = authService.getToken();
  if (token) {
    // Clone the request and add the Authorization header
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }

  return next(req);
};
