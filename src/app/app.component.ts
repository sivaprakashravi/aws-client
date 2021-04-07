import { AfterContentChecked, ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
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
    route: 'job-scheduler'
  }, {
    name: 'Locale',
    route: 'locale-setup'
  }, {
    name: 'Products',
    route: 'products'
  }, {
    name: 'Categories',
    route: 'categories'
  }, {
    name: 'Orders',
    route: 'orders'
  }, {
    name: 'Configuration',
    route: 'user-configuration'
  }];
  showUserOptions = false;
  notifications = 0;
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    public app: AppService,
    private cdRef: ChangeDetectorRef) {

  }
  async ngOnInit() {
  }

  async ngOnChanges() {
    if (this.app.user && !this.notifications) {
      const count = await this.notificationService.count();
      this.notifications = count;
    }
    // this.ngOnInit();
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
}
