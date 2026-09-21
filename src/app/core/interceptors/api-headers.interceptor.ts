import { HttpInterceptorFn } from '@angular/common/http';

export const apiHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  return next(cloned);
};
