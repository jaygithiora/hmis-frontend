import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("token");
  const clonedReq = req.clone({
    setHeaders:{
      Authorization: 'Bearer '+token
    }
  })
  return next(clonedReq);
};