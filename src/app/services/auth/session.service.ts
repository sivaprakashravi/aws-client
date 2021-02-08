import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user: any;
  accessToken;
  refreshToken;
  url: string;
  authError;
  info;
  constructor(
    private router: Router,
    private app: AppService) {
  }

  logout() {
    this.resetSession();
    this.router.navigate(['/login']);
  }

  setSession(response) {
    if (response && response.profile) {
      this.user = response.profile;
      this.app.user = this.user;
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
      localStorage.setItem('profile', JSON.stringify(response.profile));
      localStorage.setItem('username', this.user.email);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } else {
      if (response && response.code) {
        this.resetSession();
        this.authError = response;
      }
    }
  }

  setRefresh(user) {
    if (user) {
      this.setSession(user);
    }
  }

  resetSession() {
    this.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('credentials');
  }

  setUserInfo(user) {
    this.app.user = JSON.parse(user);
    if (localStorage.getItem('profile')) {
      this.setSession(JSON.parse(localStorage.getItem('profile')));
    }
  }

  public validSession() {
    return true;
    const sessionDetails = localStorage.getItem('profile');
    if (sessionDetails) {
      const expirationTime = new Date(JSON.parse(sessionDetails).exp * 1000).getTime();
      const currentTime = new Date().getTime();
      const seconds = Math.floor((expirationTime - currentTime) / 1000);
      return seconds > 0;
    } else {
      return false;
    }
  }
}
