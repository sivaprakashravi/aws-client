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

  async logout() {
    await this.resetSession();
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
      if (response.profile.role && response.profile.role.config) {
        this.app.roles = response.profile.role.config;
      } else {
        this.logout();
      }
    } else {
      if (response && response.code) {
        this.resetSession();
        this.authError = response;
      }
    }
    return;
  }

  setRefresh(user) {
    if (user) {
      this.setSession(user);
    }
  }

  resetSession() {
    this.user = null;
    this.app.user = null;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('profile');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('credentials');
    return;
  }

  setUserInfo(user) {
    this.app.user = JSON.parse(user);
    if (localStorage.getItem('profile')) {
      const profile = JSON.parse(localStorage.getItem('profile'));
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      this.setSession({ profile, accessToken, refreshToken });
    }
  }

  public validSession() {
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
