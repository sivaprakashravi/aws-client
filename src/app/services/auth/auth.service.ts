import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public isExpired(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
      return (expirationDate.getTime() < new Date().getTime());
    } else {
      return true;
    }
  }

  public decodeToken() {
    const token = localStorage.getItem('accessToken');
    return token ? this.jwtHelper.decodeToken(token) : null;

  }
}
