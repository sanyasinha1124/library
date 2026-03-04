import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard = (expectedRole: string): CanActivateFn => {
  return () => {
    const router = inject(Router);

    const user = JSON.parse(localStorage.getItem('library_user') || '{}');

    if (user.role !== expectedRole) {
      router.navigate(['/dashboard/user']);
      return false;
    }

    return true;
  };
};