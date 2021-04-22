import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppHelperService } from 'src/app/helpers/app-helper.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SessionService } from 'src/app/services/auth/session.service';
import { UsersService } from 'src/app/services/backend/user.service';
import { DialogService } from 'src/app/services/dialog.service';
import { environment } from '.././../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  showConfirm = false;
  constructor(
    private session: SessionService,
    private user: UsersService,
    private router: Router,
    private authService: AuthService,
    private dialog: DialogService,
    private appHelper: AppHelperService) { }

  ngOnInit(): void {
    this.checkSession();
    this.setForm();
  }

  checkSession() {
    const self = this;
    const isExipred = self.authService.isExpired();
    if (!isExipred) {
      self.router.navigate(['job-scheduler']);
    }
  }

  setForm() {
    this.login = new FormGroup({
      email: new FormControl(environment.username),
      password: new FormControl(environment.password),
      verificationCode: new FormControl('')
    });
  }

  async confirm() {
    const self = this;
    const session = this.login.value;
    session.email = session.email.toUpperCase();
    const user = await self.user.confirm(session);
    if (user && user.data) {
      this.dialog.simpleDialog('User Verification Successful. Login Again!');
      this.login.controls.verificationCode.setValue('');
      this.login.controls.password.setValue('');
      self.showConfirm = false;
    } else {
      this.login.controls.verificationCode.setValue('');
      this.dialog.simpleDialog('Something went wrong. Please Try Again');
      window.setTimeout(() => self.router.navigate(['login']), 2000);
    }
  }

  async newCode() {
    const self = this;
    const session = this.login.value;
    session.email = session.email.toUpperCase();
    const user = await self.user.resendVerification(session);
    if (user) {
      this.login.controls.verificationCode.setValue('');
      this.dialog.simpleDialog('New Verification code sent to registered email address');
    }
  }

  async signIn() {
    const self = this;
    const session = this.login.value;
    const validEmail = self.appHelper.validateEmail(session.email);
    if (validEmail) {
      session.email = session.email.toUpperCase();
      const user: any = await self.user.login(session);
      // self.session.setSession(user.data);
      if (user && user.data && user.data.profile) {
        const profile = await self.user.getUser(session.email);
        const role = await self.user.getRole(profile[0].role);
        user.data.profile.user = profile[0];
        user.data.profile.role = role[0];
        await self.session.setSession(user.data);
        self.router.navigate(['job-scheduler']);
      } else {
        if (user.status === 'error' && user.message === 'User is not confirmed.') {
          self.showConfirm = true;
        } else {
          this.dialog.simpleDialog('Something went wrong. Please Try Again');
          window.setTimeout(() => self.router.navigate(['login']), 2000);
        }
      }
    } else {
      this.dialog.simpleDialog('Entered Email is not valid');
    }
  }

}
