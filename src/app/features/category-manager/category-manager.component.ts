import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

import { FormGroup, FormControl } from '@angular/forms';
import { CategoryManagerService } from 'src/app/services/backend/category-manager.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { DialogService } from 'src/app/services/dialog.service';
@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss']
})
export class CategoryManagerComponent implements OnInit {
  displayedColumns: string[] = ['category',
    'subCategory',
    'interval',
    'recursive',
    'prime',
    'createdAt',
    'scheduledBy',
    'status',
    'percentage'];
  products: Product[] = [];
  rawProducts: Product[] = [];
  value = '';
  categories = [];
  subCategories = [];
  jobs = [];
  rawJobs = [];
  interval = (2 * 60 * 1000);
  fetchData = false;
  duration = ['Everyday', 'Once in a Week', 'Once in a Month', 'Twice in a Week', 'Twice in a Month'];
  newJob: FormGroup;
  constructor(private categoryManagerService: CategoryManagerService, private helpers: HelpersService, private dialog: DialogService) { }

  ngOnInit(): void {
    const self = this;
    self.setJob();
    self.getCategories();
    self.showJobs();
    // self.scrap();
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

  updateSubCategory({ value }) {
    this.subCategories = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
  }

  async seheduleJob() {
    const values = this.newJob.value;
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const type = typeof values[key];
        if (type === 'object') {
          values[key] = {
            name: values[key].name,
            nId: values[key].nId
          };
        }
      }
    }
    if (values.category && values.subCategory) {
      await this.categoryManagerService.addJob(values);
      this.dialog.simpleDialog('Job Created');
      this.setJob();
      this.showJobs();
    }
  }

  async showJobs() {
    const jobs = await this.categoryManagerService.jobs();
    this.rawJobs = jobs;
    this.jobs = jobs;
  }

  async schedule() {
    const category = this.newJob.get('category');
    const subCategory = this.newJob.get('subCategory');
    if (category && category.value && category.value.name) {
      this.rawProducts = [];
      this.products = [];
      const alreadyScheduled = this.jobs.find(j => j.id === category.value.id);
      if (!alreadyScheduled) {
        category.value.scheduledAt = new Date();
        category.value.status = 'Job Scheduled';
        const isExists = this.jobs.find(j => j.id === category.value.id);
        setTimeout(async () => {
          const { data } = await this.categoryManagerService.scrapCaterory(category.value.name);
          category.value.status = data.status;
        }, 1000);
        this.jobs.push(category.value);
      } else if (alreadyScheduled.status === 'Job Completed') {
        alreadyScheduled.count += 1;
        alreadyScheduled.status = 'Job Scheduled';
        setTimeout(async () => {
          const { data } = await this.categoryManagerService.scrapCaterory(category.value.name);
          category.value.status = data.status;
        }, 1000);
      }
    }
  }

  async checkJobStatus() {
    if (this.jobs && this.jobs.length && this.jobs.find(j => j.status !== 'Job Completed')) {
      const { data } = await this.categoryManagerService.jobStatus();
      this.fetchData = data.find(d => d.status !== 'Job Completed') ? true : false;
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
    const category = this.newJob.get('category');
    this.helpers.convertTOCSV(this.products, `${category.value}-${new Date().getTime()}`, '.csv');
  }

  search(value) {
    if (this.rawJobs && this.rawJobs.length && value && value.length >= 3) {
      value = value.toUpperCase();
      this.jobs = this.rawJobs.filter(job => {
        const key = JSON.stringify(job).toUpperCase();
        return key.indexOf(value) > -1;
      });
    } else {
      this.jobs = this.rawJobs;
    }
  }

  setJob() {
    this.newJob = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      recursive: new FormControl(false),
      prime: new FormControl(false),
      interval: new FormControl(''),
      from: new FormControl('0'),
      to: new FormControl('1000')
    });
    this.subCategories = [];
  }

}
