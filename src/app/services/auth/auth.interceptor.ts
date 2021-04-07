import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let clone: HttpRequest<any> = req.clone();
        if (!req.url.includes('/assets/')) {
            let headers: HttpHeaders = req.headers;
            let token = localStorage.getItem('accessToken');
            if (req.url.includes('/user/session')) {
                token = localStorage.getItem('refreshToken');
            }
            if (token) {
                headers = headers.set('authorization', token ? token : '');
            }
            clone = req.clone({ headers });
        }
        return next.handle(clone);
    }

}
