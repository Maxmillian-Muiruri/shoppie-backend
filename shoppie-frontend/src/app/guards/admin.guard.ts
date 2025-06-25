import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const isAdmin = user && user.role && user.role.toLowerCase() === 'admin';

  if (isAdmin) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
}; 