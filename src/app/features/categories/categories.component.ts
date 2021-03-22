import { Component, OnInit } from '@angular/core';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories = [];
  constructor(private jobSchedulerService: JobSchedulerService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  async getCategories() {
    const { data } = await this.jobSchedulerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
  }

}
