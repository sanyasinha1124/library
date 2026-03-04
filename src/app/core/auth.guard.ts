import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('library_token');

  if (!token) {
    router.navigate(['/login/user']);
    return false;
  }

  return true;
};