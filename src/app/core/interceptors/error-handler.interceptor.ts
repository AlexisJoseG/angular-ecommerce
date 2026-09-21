import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AppError } from '../models/api-response.model';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado al procesar la solicitud.';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente / red
        errorMessage = `Error de conexión: ${error.error.message}`;
      } else {
        // Códigos de estado del servidor
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta. Verifica los parámetros enviados.';
            break;
          case 404:
            errorMessage = 'El recurso solicitado no fue encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno en el servidor de la API de Platzi.';
            break;
          case 0:
            errorMessage = 'No se pudo conectar con el servidor. Comprueba tu conexión a internet.';
            break;
          default:
            errorMessage = error.error?.message || `Error del servidor (Código ${error.status})`;
            break;
        }
      }

      const domainError: AppError = {
        statusCode: error.status,
        message: errorMessage,
        timestamp: new Date().toISOString(),
        path: req.url
      };

      // Notificar al usuario mediante el sistema de Toasts
      notificationService.error(errorMessage);

      return throwError(() => domainError);
    })
  );
};
