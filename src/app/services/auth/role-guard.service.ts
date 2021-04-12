import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { AppService } from '../app.service';
import { MessageService } from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    public authGuard: AuthGuardService,
    private app: AppService,
    private message: MessageService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const self = this;
    const expectedRole = route.data.expectedRole;
    const profile = this.app.user;
    const hasAccess = this.isOk(profile.role.config, expectedRole);
    if (profile.role.name !== 'ADMIN' && (!this.auth.isAuthenticated() || !hasAccess)) {
      self.message.createMessage({
        header: 'Access Denied',
        message: `You dont have access to this module, do you want to login as another user`,
        isConfirm: true,
        yes: {
          label: 'Yes',
          action: () => {
            self.message.close();
            this.router.navigate(['logout']);
          }
        },
        no: {
          label: 'No',
          action: () => {
            self.message.close();
            window.history.back();
          }
        }
      });
      return false;
    } else {
      this.authGuard.user();
      return true;
    }
  }

  isOk(config, expectedRole) {
    const roles = config[expectedRole];
    if (roles) {
      return roles.view || roles.edit || roles.delete;
    } else {
      return true;
    }
  }
}
