import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IamService } from './iam.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private iam: IamService) { }

    createSignature(method: string, href: string, body) {
        const parser = document.createElement('a');
        parser.href = href;
        return this.iam.generateSignature(method, parser.host, parser.pathname + parser.search, body);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let clone: HttpRequest<any> = req.clone();
        if (!req.url.includes('/assets/')) {
            const iamHeaders = this.createSignature(req.method, req.urlWithParams, req.body);
            let token = localStorage.getItem('accessToken');
            if (req.url.includes('/user/session')) {
                token = localStorage.getItem('refreshToken');
            }
            if (!req.url.includes('googleapis.com')) {
                let headers = req.headers;
                headers = headers
                    .set('Authorization', iamHeaders.Authorization)
                    .set('X-Amz-Date', iamHeaders['X-Amz-Date'])
                    .set('X-Offset', this.getTimezoneOffset());
                if (token) {
                    headers = headers.set('X-Access-Token', token ? token : '');
                }
                clone = req.clone({ headers });
            }
        }
        return next.handle(clone);
    }

    getTimezoneOffset(): string {
        return String(new Date().getTimezoneOffset());

    }

}
