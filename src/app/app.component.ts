import { AfterContentChecked, ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { NotificationService } from './services/backend/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges, AfterContentChecked {
  title = 'Ecom Automation';
  date = new Date();
  user;
  navigation = [{
    name: 'Schedule',
    role: 'scheduler',
    route: 'job-scheduler',
    show: false
  }, {
    name: 'Locale',
    role: 'locale',
    route: 'locale-setup',
    show: false
  }, {
    name: 'Products',
    role: 'products',
    route: 'products',
    show: false
  }, {
    name: 'Categories',
    role: 'category',
    route: 'categories',
    show: false
  }, {
    name: 'Orders',
    role: 'orders',
    route: 'orders',
    show: false
  }, {
    name: 'Configuration',
    role: 'configuration',
    route: 'user-configuration',
    show: false
  }];
  showUserOptions = false;
  notifications = 0;
  profile: any = {};
  role: any = {};
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    public app: AppService,
    private auth: AuthGuardService,
    private cdRef: ChangeDetectorRef) {

  }
  async ngOnInit() {
    await this.auth.user();
    this.fetchNotifications();
  }

  ngOnChanges() {
    this.fetchNotifications();
  }

  async fetchNotifications() {
    if (this.app && this.app.user) {
      this.profile = this.app.user.user;
      this.role = this.app.user.role;
      this.setNavigation();
      if (this.app.user && !this.notifications) {
        const count = await this.notificationService.count();
        this.notifications = count;
      }
    }
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  gotoNotifications() {
    this.router.navigate(['notifications']);
  }

  logout() {
    this.router.navigate(['logout']);
  }

  setNavigation() {
    const role = this.role.config;
    this.navigation.forEach(nav => {
      const navRole = nav.role;
      const configuredRole: any = role[navRole];
      for (const action in configuredRole) {
        if (configuredRole[action]) {
          nav.show = true;
        }
      }
    });
    this.navigation = this.navigation.filter(n => n.show);
  }
}
