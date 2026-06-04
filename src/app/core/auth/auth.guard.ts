import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Carrega a sessão assincronamente (Storage/IndexedDB)
  const isLoggedIn = await authService.loadSession();

  if (isLoggedIn) {
    return true;
  }

  // Se não estiver logado, joga para a tela de login
  router.navigate(['/login']);
  return false;
};
