import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryManagerService } from 'src/app/services/backend/category-manager.service';
import { LocaleService } from 'src/app/services/backend/locale.service';
import { DialogService } from 'src/app/services/dialog.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locale-setup',
  templateUrl: './locale-setup.component.html',
  styleUrls: ['./locale-setup.component.scss']
})
export class LocaleSetupComponent implements OnInit {
  displayedColumns: string[] = ['name',
    'dealerCharge',
    'deliveryCharge',
    'actions'];
  displayedApplyColumns: string[] = ['category', 'subCategory', 'recursive', 'locale', 'count', 'actions', 'refresh', 'archive'];
  formula: FormGroup;
  newFormula: FormGroup;
  values = ['%', 'value'];
  locales = [];
  categories = [];
  subCategories = [];
  localeUpdates = [];
  constructor(
    private localeService: LocaleService,
    private dialog: DialogService,
    private router: Router,
    private categoryManagerService: CategoryManagerService) { }

  ngOnInit(): void {
    this.reset();
    this.resetNewFormula();
    this.listLocales();
    this.getCategories();
    this.getLocales();
  }

  async getCategories() {
    const { data } = await this.categoryManagerService.categories();
    data.forEach(d => d.count = 0);
    this.categories = data;
  }

  updateSubCategory({ value }) {
    this.subCategories = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
  }

  reset() {
    this.formula = new FormGroup({
      name: new FormControl(''),
      dealerCharge: new FormControl(0),
      deliveryCharge: new FormControl(0),
      dealerChargeType: new FormControl('%'),
      deliveryChargeType: new FormControl('%'),
    });
  }

  resetNewFormula() {
    this.newFormula = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      locale: new FormControl('')
    });
  }

  numberOnly(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 46 || charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
      return false;
    }
    return true;
  }

  async listLocales() {
    const locales = await this.localeService.getLocales();
    this.locales = locales;
  }

  async add() {
    const added = await this.localeService.addLocale(this.formula.value);
    if (added) {
      this.dialog.simpleDialog('Locale Added');
      this.listLocales();
    }
  }

  async removeLocale({ localeId }) {
    if (localeId) {
      const deleted = await this.localeService.deleteLocale(localeId);
      if (deleted) {
        this.dialog.simpleDialog('Locale Deleted');
        this.listLocales();
      }
    }
  }

  async apply(method, isRecursive?, row?) {
    let filter: any = {};
    if (method === 'applyOnly') {
      filter = row;
      filter.category = filter.category.nId;
      filter.subCategory = filter.subCategory.nId;
      filter.status = 'applied';
      filter.noSave = true;
      method = 'applyLog';
    } else {
      let category = this.newFormula.value.category;
      category = category.nId;
      let subCategory = this.newFormula.value.subCategory;
      subCategory = subCategory.nId;
      filter = {
        locale: _.pick(this.newFormula.value.locale, ['localeId', 'name']),
        recursive: isRecursive ? true : false,
        category,
        subCategory
      };
      if (method === 'addLog') {
        filter.status = 'saved';
      }
      if (method === 'applyLog') {
        filter.status = 'applied';
      }
    }
    const locale = await this.localeService[method](filter);
    this.dialog.simpleDialog(locale.message);
    this.resetNewFormula();
    this.getLocales();
  }

  async getLocales() {
    const logs = await this.localeService.getLocaleLogs();
    logs.forEach(l => {
      l.category = this.categories.find(c => c.nId === l.category);
      l.subCategory = l.category.subCategory.find(c => c.nId === l.subCategory);
    });
    this.localeUpdates = logs;
  }

  async archiveLocale(locale: any) {
    const logs = await this.localeService.archiveLog(locale.log);
    this.dialog.simpleDialog(logs ? 'Log Archived Successfully!' : 'Error during Archive!!');
    this.getLocales();
  }

  async refresh(locale: any) {
    const { log, category, subCategory } = locale;
    const logs = await this.localeService.refresh(log, category.nId, subCategory.nId);
    this.dialog.simpleDialog(logs ? 'Product Count Updated Successfully!' : 'Error during Count Update!!');
    this.getLocales();
  }

  async navToPdts({ category, subCategory, count }) {
    if (count && category && subCategory) {
      this.router.navigate(['products'], { queryParams: { category: category.nId, subCategory: subCategory.nId } });
    }
  }

}
