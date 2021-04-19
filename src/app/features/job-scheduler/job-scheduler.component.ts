import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { FormGroup, FormControl } from '@angular/forms';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ConfigurationService } from 'src/app/services/backend/configuration.service';
import { MessageService } from 'src/app/services/message.service';
import { AppService } from 'src/app/services/app.service';
@Component({
  selector: 'app-job-scheduler',
  templateUrl: './job-scheduler.component.html',
  styleUrls: ['./job-scheduler.component.scss']
})
export class JobSchedulerComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'category',
    'subCategory',
    'subCategory1',
    'subCategory2',
    'subCategory3',
    'interval',
    'from',
    'to',
    'createdAt',
    'scheduledBy',
    'recursive',
    'prime',
    'status',
    'percentage',
    'actions'];
  products: Product[] = [];
  rawProducts: Product[] = [];
  value = '';
  categories = [];
  subCategories = [];
  subCategories1 = [];
  subCategories2 = [];
  subCategories3 = [];
  jobs = [];
  rawJobs = [];
  interval = 20000;
  fetchData = false;
  duration = ['Now', 'Everyday', 'Once in a Week', 'Once in a Month', 'Twice in a Week', 'Twice in a Month'];
  newJob: FormGroup;
  config: any = {
    maxRange: '10000'
  };
  temp: any = {};
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private helpers: HelpersService,
    private dialog: DialogService,
    private configuration: ConfigurationService,
    private message: MessageService,
    public app: AppService) { }

  async ngOnInit() {
    const self = this;
    self.setJob();
    await self.getCategories();
    await self.getConfiguration();
    self.showJobs();
    // self.scrap();
    self.temp = window.setInterval(() => {
      self.refreshJobs();
    }, self.interval);
  }

  async scrap() {
    this.rawProducts = [];
    this.products = [];
    const { data } = await this.jobSchedulerService.scrappedData();
    this.rawProducts = data;
    this.products = data;
  }

  updateSubCategory({ value }) {
    this.subCategories1 = [];
    this.subCategories2 = [];
    this.subCategories3 = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
  }

  updateSubCategory1({ value }) {
    this.subCategories2 = [];
    this.subCategories3 = [];
    this.subCategories1 = value.subCategory;
  }

  updateSubCategory2({ value }) {
    this.subCategories3 = [];
    this.subCategories2 = value.subCategory;
  }

  updateSubCategory3({ value }) {
    this.subCategories3 = value.subCategory;
  }

  checkNewJob({ category, subCategory, subCategory1, subCategory2, subCategory3, from, to }) {
    if (this.rawJobs && this.rawJobs.length) {
      const exist = this.rawJobs.filter(r => {
        const sameCat = r.category.nId === category.nId;
        const sameSubCat = r.subCategory.nId === subCategory.nId;
        const sameSubCat1nId = subCategory1.nId && r.subCategory1.nId === subCategory1.nId;
        const sameSubCat1node = subCategory1.node && r.subCategory1.node === subCategory1.node;
        const sameSubCat2nId = subCategory2.nId && r.subCategory2.nId === subCategory2.nId;
        const sameSubCat2node = subCategory2.node && r.subCategory2.node === subCategory2.node;
        const sameSubCat3nId = subCategory3.nId && r.subCategory3.nId === subCategory3.nId;
        const sameSubCat3node = subCategory3.node && r.subCategory3.node === subCategory3.node;
        const sameFrom = r.from === from;
        const sameTo = r.to === to;
        const btwnFrom = from >= r.from && from <= r.to;
        const btwnTo = to >= r.from && to <= r.to;
        return sameCat && sameSubCat && (sameSubCat1nId || sameSubCat1node)
        && (sameSubCat2nId || sameSubCat2node)
        && (sameSubCat3nId || sameSubCat3node)
        && sameFrom && sameTo && btwnFrom && btwnTo;
      });
      return exist.length ? false : true;
    } else {
      return true;
    }
  }

  async seheduleJob() {
    const values = this.newJob.value;
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const type = typeof values[key];
        if (type === 'object') {
          const nId = values[key].nId;
          const node = values[key].node;
          const id = values[key].id;
          values[key] = {
            name: values[key].name
          };
          if (id) {
            values[key].id = id;
          }
          if (nId) {
            values[key].nId = nId;
          }
          if (node) {
            values[key].node = node;
          }
        }
      }
    }
    if (values.category && (values.subCategory || values.subCategory1)) {
      const isValid = await this.checkNewJob(values);
      if (isValid) {
        await this.jobSchedulerService.addJob(values);
        this.dialog.simpleDialog('Job Created');
        this.setJob();
        this.showJobs();
      } else {
        this.dialog.simpleDialog('Same Category / Sub Category Job is already Scheduled');
      }
    }
  }

  async showJobs() {
    const jobs = await this.jobSchedulerService.jobs();
    this.rawJobs = jobs;
    this.jobs = jobs;
  }

  async refreshJobs() {
    if (this.rawJobs && this.rawJobs.length) {
      if (this.rawJobs.find(r => r.status === 'Running' || r.status === 'New' || r.status === 'Scheduled')) {
        this.showJobs();
      }
    }
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
          const { data } = await this.jobSchedulerService.scrapCaterory(category.value.name);
          category.value.status = data.status;
        }, 1000);
        this.jobs.push(category.value);
      } else if (alreadyScheduled.status === 'Job Completed') {
        alreadyScheduled.count += 1;
        alreadyScheduled.status = 'Job Scheduled';
        setTimeout(async () => {
          const { data } = await this.jobSchedulerService.scrapCaterory(category.value.name);
          category.value.status = data.status;
        }, 1000);
      }
    }
  }

  async checkJobStatus() {
    if (this.jobs && this.jobs.length && this.jobs.find(j => j.status !== 'Job Completed')) {
      const { data } = await this.jobSchedulerService.jobStatus();
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
    const { data } = await this.jobSchedulerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
  }

  async getConfiguration() {
    const config = await this.configuration.getConfiguration();
    if (config) {
      this.config = config;
    }
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
      subCategory1: new FormControl(''),
      subCategory2: new FormControl(''),
      subCategory3: new FormControl(''),
      recursive: new FormControl(false),
      prime: new FormControl(false),
      paused: new FormControl(false),
      interval: new FormControl('Now'),
      from: new FormControl('0'),
      to: new FormControl('1000')
    });
    this.subCategories = [];
    this.subCategories1 = [];
  }

  checkRange($event, range = 1000) {
    // const val = $event.target.value;
    // if (Number(val) > Number(range)) {
    //   $event.target.value = Number(range);
    // }
  }

  ngOnDestroy(): void {
    const self = this;
    window.clearInterval(self.temp);
  }

  removeJob(scheduleId) {
    this.message.createMessage({
      header: `Confirm Delete`,
      message: 'Do you want to remove the selected Job?',
      isConfirm: true,
      yes: {
        label: 'Ok',
        action: async () => {
          await this.jobSchedulerService.remove(scheduleId);
          this.message.close();
          this.dialog.simpleDialog('Job Successfully Removed');
          this.showJobs();
        }
      },
      no: {
        label: 'Cancel',
        action: () => {
          this.message.close();
        }
      }
    });
  }

  async pauseJob(job) {
    const paused = await this.jobSchedulerService.pause(job);
    if (paused) {
      this.dialog.simpleDialog(`Job Successfully ${job.paused ? 'Resumed' : 'Paused'}`);
      this.showJobs();
    } else {
      this.dialog.simpleDialog('Something went wrong! Please try after sometime.');
    }
  }

  async primeChange(job) {
    const paused = await this.jobSchedulerService.prime(job);
    if (paused) {
      this.dialog.simpleDialog(`Prime Job Updated Successfully`);
      this.showJobs();
    } else {
      this.dialog.simpleDialog('Something went wrong! Please try after sometime.');
    }
  }

  async recursiveChange(job) {
    const paused = await this.jobSchedulerService.recursive(job);
    if (paused) {
      this.dialog.simpleDialog(`Recursive Job Updated Successfully`);
      this.showJobs();
    } else {
      this.dialog.simpleDialog('Something went wrong! Please try after sometime.');
    }
  }

}
