import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppHelperService } from 'src/app/helpers/app-helper.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SessionService } from 'src/app/services/auth/session.service';
import { UsersService } from 'src/app/services/backend/user.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;
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
      email: new FormControl(''),
      password: new FormControl('')
    });
  }

  async signIn() {
    const self = this;
    const session = this.login.value;
    const validEmail = self.appHelper.validateEmail(session.email);
    if (validEmail) {
      session.email = session.email.toUpperCase();
      const user = await self.user.login(session);
      if (user && user.data) {
        self.session.setSession(user.data);
        self.router.navigate(['job-scheduler']);
      } else {
        this.dialog.simpleDialog('Something went wrong. Please Try Again');
        window.setTimeout(() => self.router.navigate(['login']), 2000);
      }
    } else {
      this.dialog.simpleDialog('Entered Email is not valid');
    }
  }

}
