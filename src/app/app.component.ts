import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/backend/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Ecom Automation';
  date = new Date();
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
  }];
  notifications = 0;
  constructor(private notificationService: NotificationService, private router: Router) {

  }
  async ngOnInit() {
    const count = await this.notificationService.count();
    this.notifications = count;
  }

  gotoNotifications() {
    this.router.navigate(['notifications']);
  }
}
