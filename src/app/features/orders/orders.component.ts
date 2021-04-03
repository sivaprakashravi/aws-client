import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';
import { ProductService } from 'src/app/services/backend/product.service';
import * as _ from 'lodash';
import { DialogService } from 'src/app/services/dialog.service';
import { AppService } from 'src/app/services/app.service';
import { OrdersService } from 'src/app/services/backend/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  displayedColumns = [
    'order_id',
    'invoice_ref_num',
    'create_time',
    'amount',
    'is_cod_mitra',
    'status'];
  filter: FormGroup;
  category: any = {};
  statuses = [];
  shops = [];
  orders = [];
  totalOrders;
  pages = 0;
  activePage = 1;
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private router: ActivatedRoute,
    private dialog: DialogService,
    private ordersService: OrdersService,
    private appService: AppService) {
  }

  async ngOnInit() {
    this.setFilter();
    await this.getStatuses();
    await this.getShops();
    this.applyParams();
    this.search();
  }

  applyParams() {
    this.search(this.filter.value);
  }

  setFilter() {
    this.filter = new FormGroup({
      shop_id: new FormControl(''),
      status: new FormControl(''),
      from_date: new FormControl(new Date()),
      to_date: new FormControl(new Date())
    });
  }

  async search(pageNo?) {
    const orders = await this.ordersService.orders({});
    this.orders = orders;
    // this.pages = Math.ceil(total / 25);
    // this.totalProducts = total;
    this.activePage = pageNo;
  }

  async getStatuses() {
    const data = await this.ordersService.statuses();
    if (data) {
      const statuses = [];
      for (const [key, value] of Object.entries(data)) {
        statuses.push({ key, value });
      }
      this.statuses = statuses;
    }
  }

  async getShops() {
    this.shops = [{
      name: 'Shop 1',
      id: 1
    }, {
      name: 'Shop 2',
      id: 2
    }];
  }

  page(pageNo) {
    if (this.activePage !== pageNo) {
      this.search(pageNo);
    }
  }

}
