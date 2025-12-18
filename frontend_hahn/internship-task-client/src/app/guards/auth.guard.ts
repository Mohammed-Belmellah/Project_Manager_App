import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Check if the token exists in LocalStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    // 2. Token found? You are logged in! Allow access.
    // (Even if it's expired, your Interceptor will silently refresh it)
    return true;
  } else {
    // 3. No token? You must login. Redirect to Login page.
    router.navigate(['/login']);
    return false;
  }
};