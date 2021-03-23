import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryService } from 'src/app/services/backend/category.service';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  form: FormGroup;
  categories = [];
  subCategories = [];
  constructor(private jobSchedulerService: JobSchedulerService, private categoryService: CategoryService, private dialog: DialogService) { }

  async ngOnInit() {
    this.setForm();
    await this.getCategories();
  }

  async getCategories() {
    const { data } = await this.jobSchedulerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
  }

  updateSubCategory({ value }) {
    this.subCategories = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
    if (value.storeId) {
      this.form.controls.storeId.setValue(value.storeId);
    }
  }

  updateStoreId({ value }) {
    if (value.storeId) {
      this.form.controls.storeId.setValue(value.storeId);
    } else {
      const category = this.form.get('category');
      this.form.controls.storeId.setValue(category.value.storeId);
    }
  }

  setForm() {
    this.form = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      storeId: new FormControl(null)
    });
    this.subCategories = [];
  }

  cancel() {
    this.setForm();
  }

  async update() {
    const { category, subCategory, storeId } = this.form.value;
    const data: any = {};
    if ((category || subCategory) && storeId) {
      data.category = category.nId;
      data.storeId = storeId;
      if (subCategory) {
        data.subCategory = subCategory.nId;
      }
    }
    const updated = await this.categoryService.updateCategory(data);
    if (updated) {
      this.dialog.simpleDialog('Store Updated in Selected Category');
      this.ngOnInit();
    }
  }

}
