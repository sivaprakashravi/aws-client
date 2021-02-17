import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

import { FormControl } from '@angular/forms';
import { CategoryManagerService } from 'src/app/services/backend/category-manager.service';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  displayedColumns: string[] = ['asin', 'label', 'category', 'buybox_new_landed_price', 'buybox_new_listing_price', 'offerPercentage'];
  products: Product[] = [];
  rawProducts: Product[] = [];
  position = new FormControl('');
  positionOptions = ['mobile', 'computer'];
  value = '';
  categories = [];
  jobs = [];
  interval = (2 * 60 * 1000);
  fetchData = false;
  constructor(private categoryManagerService: CategoryManagerService, private helpers: HelpersService) { }

  ngOnInit(): void {
    const self = this;
    self.getCategories();
    self.scrap();
    setInterval(() => {
      self.checkJobStatus();
    }, self.interval);
  }

  async scrap() {
    this.rawProducts = [];
    this.products = [];
    const { data } = await this.categoryManagerService.scrappedData();
    this.rawProducts = data;
    this.products = data;
  }

  async schedule() {
    if (this.position && this.position.value && this.position.value.name) {
      this.rawProducts = [];
      this.products = [];
      const alreadyScheduled = this.jobs.find(j => j.id === this.position.value.id);
      if (!alreadyScheduled) {
        this.position.value.scheduledAt = new Date();
        this.position.value.status = 'Job Scheduled';
        const isExists = this.jobs.find(j => j.id === this.position.value.id);
        setTimeout(async () => {
          const { data } = await this.categoryManagerService.scrapCaterory(this.position.value.name);
          this.position.value.status = data.status;
        }, 1000);
        this.jobs.push(this.position.value);
      } else if (alreadyScheduled.status === 'Job Completed') {
        alreadyScheduled.count += 1;
        alreadyScheduled.status = 'Job Scheduled';
        setTimeout(async () => {
          const { data } = await this.categoryManagerService.scrapCaterory(this.position.value.name);
          this.position.value.status = data.status;
        }, 1000);
      }
    }
  }

  async checkJobStatus() {
    if (this.jobs && this.jobs.length && this.jobs.find(j => j.status !== 'Job Completed')) {
      const { data } = await this.categoryManagerService.jobStatus();
      this.fetchData = data.find(d => d.status !== 'Job Completed' ) ? true : false;
      data.forEach(({ job, status }) => {
        const jId = this.jobs.find(j => j.name === job);
        if (jId) {
          jId.status = status;
        }
      });
    }
    if (this.fetchData) {
      this.scrap();
    }
  }

  async getCategories() {
    const { data } = await this.categoryManagerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
  }

  download() {
    this.helpers.convertTOCSV(this.products, `${this.position.value}-${new Date().getTime()}`, '.csv');
  }

  search(value) {
    if (this.rawProducts && this.rawProducts.length && value && value.length >= 3) {
      value = value.toUpperCase();
      this.products = this.rawProducts.filter(prod => {
        const key = JSON.stringify(prod).toUpperCase();
        return key.indexOf(value) > -1;
      });
    } else {
      this.products = this.rawProducts;
    }
  }

}
