import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/backend/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  displayedColumns = [
    'asin',
    'salePrice',
    'shippingPrice'];
  notifications = [];
  totalNotifications = 0;
  pages = 0;
  activePage = 1;
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.search();
  }

  async search(pageNo?) {
    const filter = {
      limit: 25,
      pageNo: pageNo ? pageNo : 1
    };
    const { notifications, total } = await this.notificationService.getNotifications(filter);
    this.notifications = notifications;
    this.pages = Math.ceil(total / 25);
    this.totalNotifications = total;
    this.activePage = filter.pageNo;
  }

  page(pageNo) {
    if (this.activePage !== pageNo) {
      this.search(pageNo);
    }
  }

}
