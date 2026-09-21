import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

/**
 * Functional Route Guard que valida que el parámetro :id sea un entero positivo
 */
export const numericIdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const idParam = route.paramMap.get('id');

  if (!idParam) {
    router.navigate(['/catalog']);
    return false;
  }

  const numericId = Number(idParam);
  const isValid = Number.isInteger(numericId) && numericId > 0;

  if (!isValid) {
    notificationService.warning(`El ID de producto "${idParam}" no es válido.`);
    router.navigate(['/catalog']);
    return false;
  }

  return true;
};
