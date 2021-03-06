import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CategoryManagerService } from 'src/app/services/backend/category-manager.service';
import { LocaleService } from 'src/app/services/backend/locale.service';
import { DialogService } from 'src/app/services/dialog.service';
import * as _ from 'lodash';

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
    displayedApplyColumns: string[] = ['id', 'category', 'subCategory', 'locale', 'message'];
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
    private categoryManagerService: CategoryManagerService) { }

  ngOnInit(): void {
    this.reset();
    this.listLocales();
    this.getCategories();
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

  async apply() {
    let category = this.newFormula.value.category;
    category = category.nId;
    let subCategory = this.newFormula.value.subCategory;
    subCategory = subCategory.nId;
    const filter: any = {
      locale: this.newFormula.value.locale,
      category,
      subCategory
    };
    const locale = await this.localeService.applyLocale(filter);
    this.dialog.simpleDialog(locale.message);
    const applied = _.cloneDeep(this.newFormula.value);
    applied.message = locale.message;
    applied.id = this.localeUpdates.length + 1;
    this.localeUpdates = _.concat(this.localeUpdates, [applied]);
  }

}
