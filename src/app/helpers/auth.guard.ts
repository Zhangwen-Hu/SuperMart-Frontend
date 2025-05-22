import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export function authGuard() {
  const tokenService = inject(TokenStorageService);
  const router = inject(Router);

  if (tokenService.getToken()) {
    return true;
  }

  return router.parseUrl('/login');
}

export function adminGuard() {
  const tokenService = inject(TokenStorageService);
  const router = inject(Router);

  if (tokenService.getToken() && tokenService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/login');
} 