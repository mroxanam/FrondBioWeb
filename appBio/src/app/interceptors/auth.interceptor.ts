import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clonar la solicitud y agregar withCredentials
  const authReq = req.clone({
    withCredentials: true,
    headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
  });

  console.log('Interceptor - Request:', {
    url: authReq.url,
    method: authReq.method,
    withCredentials: authReq.withCredentials,
    headers: authReq.headers.keys()
  });

  return next(authReq);
};
