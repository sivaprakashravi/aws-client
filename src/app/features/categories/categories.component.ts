import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
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
  category: FormGroup;
  customCategories = [];
  categories = [];
  subCategories = [];
  subCategories1 = [];
  subCategories2 = [];
  subCategories3 = [];
  isCategoryUpdate = false;
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private categoryService: CategoryService,
    private dialog: DialogService,
    public app: AppService) { }

  async ngOnInit() {
    this.setForm();
    this.newCategory();
    await this.getCategories();
  }

  async getCategories() {
    const { data } = await this.jobSchedulerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
    this.customCategories = data.filter(d => d.createdBy === 'USER');
  }

  updateStoreInfo(value, cat) {
    if (value && value.subCategory) {
      this[cat] = value.subCategory;
    }
    if (value.storeId) {
      this.form.controls.storeId.setValue(value.storeId);
      this.form.controls.categoryCode.setValue(value.categoryCode);
    }
  }

  updateSubCategory({ value }) {
    this.subCategories1 = [];
    this.subCategories2 = [];
    this.subCategories3 = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
      this.updateStoreInfo(value, 'subCategory');
    }
  }

  updateSubCategory1({ value }) {
    this.subCategories2 = [];
    this.subCategories3 = [];
    this.subCategories1 = value.subCategory;
    this.updateStoreInfo(value, 'subCategory1');
  }

  updateSubCategory2({ value }) {
    this.subCategories3 = [];
    this.subCategories2 = value.subCategory;
    this.updateStoreInfo(value, 'subCategory2');
  }

  updateSubCategory3({ value }) {
    this.subCategories3 = value.subCategory;
    this.updateStoreInfo(value, 'subCategory3');
  }

  updateStoreId({ value }) {
    if (value.storeId) {
      this.form.controls.storeId.setValue(value.storeId);
      this.form.controls.categoryCode.setValue(value.categoryCode);
    } else {
      const category = this.form.get('category');
      this.form.controls.storeId.setValue(category.value.storeId);
      this.form.controls.categoryCode.setValue(category.value.categoryCode);
    }
  }

  setForm() {
    this.form = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      subCategory1: new FormControl(''),
      subCategory2: new FormControl(''),
      subCategory3: new FormControl(''),
      storeId: new FormControl(null),
      categoryCode: new FormControl(null)
    });
    this.subCategories = [];
    this.subCategories1 = [];
    this.subCategories2 = [];
    this.subCategories3 = [];
  }

  newCategory() {
    this.category = new FormGroup({
      name: new FormControl(''),
      nId: new FormControl(''),
      _id: new FormControl(''),
      subCategory: new FormControl([])
    });
    this.isCategoryUpdate = false;
  }

  async createCategory() {
    const value = this.category.value;
    if (value && value.name) {
      if (!this.isCategoryUpdate) {
        await this.categoryService.addCategory(value);
        this.dialog.simpleDialog('Category Added');
        this.newCategory();
        this.getCategories();
      } else {
        const subs = value.subCategory;
        const query = {
          name: value.name,
          nId: value.nId,
          subCategory: subs.map(s => {
            const ssubs = s.value.subCategory;
            const squery = {
              name: s.value.name,
              nId: s.value.nId,
              subCategory: ssubs.map(ss => ss.value)
            };
            return squery;
          })
        };
        await this.categoryService.updateCategory(query);
        this.dialog.simpleDialog('Category Updated');
      }
    }
  }

  clearCategory() {
    this.newCategory();
  }

  cancel() {
    this.setForm();
  }

  addSubCategory() {
    const subCategories = this.category.value.subCategory;
    subCategories.push(this.subsForm({}));
    this.category.controls.subCategory.setValue(subCategories);
  }

  async removeMainCategory(nId) {
    if (nId) {
      const removed = await this.categoryService.removeCategory(nId);
      if (removed) {
        this.dialog.simpleDialog('Category Removed Successfully');
        await this.getCategories();
        this.clearCategory();
      }
    }
  }

  addSubCategory1(subCategory, sub) {
    sub.push(this.subsForm({}));
    subCategory.controls.subCategory.setValue(sub);
  }

  removeSubCategory1(subCategory, category) {
    let subs = category.value.subCategory.map(s => s.value);
    subs = subs.filter(s => s.nId !== subCategory.value.nId);
    subs = subs.map(s => this.subsForm(s));
    category.controls.subCategory.setValue(subs);

  }

  removeSubCategory2(subCategory, sub) {

  }

  subsForm({ name = '', nId = '', subCategory = [] }) {
    const subs = subCategory.map(s => this.subsForm(s));
    const subCat = new FormGroup({
      name: new FormControl(name),
      nId: new FormControl(nId),
      subCategory: new FormControl(subs)
    });
    return subCat;
  }

  async update() {
    const { category, subCategory, subCategory1, subCategory2, subCategory3, storeId, categoryCode } = this.form.value;
    const data: any = {};
    if ((category || subCategory) && storeId && categoryCode) {
      data.category = category.nId;
      data.storeId = storeId;
      data.categoryCode = categoryCode;
      if (subCategory) {
        data.subCategory = subCategory.nId;
      }
      if (subCategory1) {
        data.subCategory1 = subCategory1.nId;
      }
      if (subCategory2) {
        data.subCategory2 = subCategory2.nId;
      }
      if (subCategory3) {
        data.subCategory3 = subCategory3.nId;
      }
    }
    const updated = await this.categoryService.updateStoreInfo(data);
    if (updated) {
      this.dialog.simpleDialog('Store Updated in Selected Category');
      this.ngOnInit();
    }
  }

  updateCategory(event) {
    const { name, nId, _id, subCategory = [], subCategory1 = [], subCategory2 = [], subCategory3 = [] } = event.value;
    if (name && nId && _id) {
      this.category.controls.name.setValue(name);
      this.category.controls.nId.setValue(nId);
      this.category.controls._id.setValue(_id);
      const subs = subCategory.map(s => this.subsForm(s));
      this.category.controls.subCategory.setValue(subs);
      const subs1 = subCategory1.map(s => this.subsForm(s));
      if(this.category.controls.subCategory1) {
        this.category.controls.subCategory1.setValue(subs1);
      }
      const subs2 = subCategory2.map(s => this.subsForm(s));
      if(this.category.controls.subCategory2) {
        this.category.controls.subCategory2.setValue(subs2);
      }
      const subs3 = subCategory3.map(s => this.subsForm(s));
      if(this.category.controls.subCategory3) {
        this.category.controls.subCategory3.setValue(subs3);
      }
      this.isCategoryUpdate = true;
    } else {
      this.clearCategory();
    }
  }

}
