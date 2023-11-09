import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const newReq = req.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*', // O ajusta el origen permitido según tu configuración
      },
    });
    return next.handle(newReq);
  }
}
