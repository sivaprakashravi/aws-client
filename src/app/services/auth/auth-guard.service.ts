import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, private session: SessionService, private app: AppService) { }
  canActivate(): boolean {
    if (this.app.dev) {
      return true;
    }
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      this.session.resetSession();
      return false;
    } else {
      this.user();
      return true;
    }
  }

  async user() {
    const profile = localStorage.getItem('profile');
    if (!profile) {
      this.router.navigate(['login']);
      this.session.resetSession();
    } else {
      if (profile) {
        this.session.setUserInfo(profile);
      }
    }
  }
}
