import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { apiHeadersInterceptor } from './core/interceptors/api-headers.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      withInterceptors([
        apiHeadersInterceptor,
        loadingInterceptor,
        errorHandlerInterceptor
      ])
    )
  ]
};
