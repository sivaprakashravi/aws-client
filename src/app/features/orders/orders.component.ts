import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrdersService } from 'src/app/services/backend/orders.service';
import { ToastService } from 'src/app/services/toast.service';

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
  today = new Date();
  constructor(
    private ordersService: OrdersService,
    private toast: ToastService) {
  }

  async ngOnInit() {
    await this.getStatuses();
    await this.getShops();
    this.setFilter();
    // this.applyParams();
    // this.search();
  }

  applyParams() {
    this.search(this.filter.value);
  }

  setFilter() {
    this.filter = new FormGroup({
      shop_id: new FormControl(this.shops[0]),
      status: new FormControl(this.statuses[0]),
      from_date: new FormControl(moment().subtract(3, 'days').format()),
      to_date: new FormControl(moment().format())
    });
  }

  async search(pageNo?) {
    const filters = this.filter.value;
    if (filters.from_date && filters.to_date && moment(filters.to_date).diff(filters.from_date, 'days') <= 3) {
      const orders = await this.ordersService.orders(this.filter.value);
      this.orders = orders;
      // this.pages = Math.ceil(total / 25);
      // this.totalProducts = total;
      this.activePage = pageNo;
    } else {
      this.toast.createToast({message: 'Invalid date Range. Range should not be greater than 3'});
    }
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
