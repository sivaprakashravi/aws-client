import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';
import { ProductService } from 'src/app/services/backend/product.service';
import * as _ from 'lodash';
import { DialogService } from 'src/app/services/dialog.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  displayedColumns = [
    'asin',
    'sku',
    'label',
    'item_dimensions_weight',
    'price',
    'link',
  ];
  filter: FormGroup;
  category: any = {};
  subCategory: any = {};
  subCategory1: any = {};
  subCategory2: any = {};
  subCategory3: any = {};
  categories = [];
  subCategories = [];
  subCategories1 = [];
  subCategories2 = [];
  subCategories3 = [];
  products = [];
  rawProducts = [];
  totalProducts;
  pages = 0;
  activePage = 1;
  limit = 10;
  limits = [10, 20, 30, 40, 50];
  pageNos = [];
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private router: ActivatedRoute,
    private dialog: DialogService,
    private productService: ProductService,
    private appService: AppService
  ) {
    this.router.queryParams.subscribe((params) => {
      this.category = params.category;
      this.subCategory = params.subCategory;
      this.subCategory1 = params.subCategory1;
      this.subCategory2 = params.subCategory2;
      this.subCategory3 = params.subCategory3;
    });
  }

  async ngOnInit() {
    this.setFilter();
    await this.getCategories();
    this.applyParams();
  }

  applyParams() {
    if (this.category && this.subCategory) {
      const category = this.categories.find((c) => c.nId === this.category);
      this.subCategories = category.subCategory;
      const subCategory = this.subCategories.find(
        (c) => c.nId === this.subCategory
      );
      this.subCategories1 = subCategory.subCategory;
      const catLoop = [1, 2, 3];
      const loop: any = {};
      catLoop.forEach(c => {
        if (this[`subCategories1${c}`]) {
          loop[`subCategory${c}`] = this[`subCategories1${c}`].find(cc => cc.nId === this.subCategory1);

        }
      });
      this.filter = new FormGroup({
        category: new FormControl(category),
        subCategory: new FormControl(subCategory),
        subCategory1: new FormControl(loop.subCategory1),
        subCategory2: new FormControl(loop.subCategory2),
        subCategory3: new FormControl(loop.subCategory3),
        asin: new FormControl(''),
        sku: new FormControl('')
      });
      this.search();
    }
  }

  setFilter() {
    this.filter = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl(''),
      subCategory1: new FormControl(''),
      subCategory2: new FormControl(''),
      subCategory3: new FormControl(''),
      asin: new FormControl(''),
      sku: new FormControl(''),
    });
    this.subCategories = [];
    this.subCategories1 = [];
  }

  async search(pageNo?) {
    const catLoop = [1, 2, 3];
    const fv = this.filter.value;
    const { category, subCategory, asin, sku } = fv;
    if (category.nId && subCategory.nId) {
      const filter: any = {
        category: category.nId,
        subCategory: subCategory.nId,
        limit: this.limit,
        pageNo: pageNo ? pageNo : 1,
        asin,
        sku
      };
      catLoop.forEach(c => {
        const sub = fv[`subCategory${c}`];
        if (sub && (sub.nId || sub.node)) {
          filter[`subCategory${c}`] = sub.nId
            ? sub.nId
            : sub.node;
        }
      });
      const { products, total } = await this.productService.getProducts(filter);
      this.products = products;
      this.pages = Math.ceil(total / this.limit);
      this.totalProducts = total;
      this.activePage = filter.pageNo;
      this.setPage();
    }
  }

  async getCategories() {
    const { data } = await this.jobSchedulerService.categories();
    data.forEach((d) => (d.count = 0));
    this.categories = data;
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

  page(pageNo) {
    if (this.activePage !== pageNo) {
      this.search(pageNo);
    }
  }

  setPage() {
    const { limit, activePage, pages } = this;
    this.pageNos = [];
    if (activePage > 2) {
      this.pageNos.push(activePage - 2);
    }
    if (activePage > 1) {
      this.pageNos.push(activePage - 1);
    }
    this.pageNos.push(activePage);
    if (activePage < pages - 1) {
      this.pageNos.push(activePage + 1);
    }
    if (activePage < pages - 2) {
      this.pageNos.push(activePage + 2);
    }
  }

  async download() {
    const { category, subCategory, subCategory1 } = this.filter.value;
    if (category.nId && subCategory.nId) {
      const filter: any = {
        category: category.nId,
        subCategory: subCategory.nId,
        storeId: subCategory.nId ? subCategory.storeId : category.storeId,
        categoryCode: subCategory.nId
          ? subCategory.categoryCode
          : category.categoryCode,
      };
      if (subCategory1.nId || subCategory1.node) {
        filter.subCategory1 = subCategory1.nId
          ? subCategory1.nId
          : subCategory1.node;
      }
      if (filter.storeId && filter.categoryCode) {
        let products = await this.productService.downloadProducts(filter);
        products = products.map((p) => _.omit(p, 'altImages'));
        this.appService.convertTOCSV(
          products,
          `${category.name}-${subCategory.name}-${new Date().getTime()}`,
          '.csv'
        );
      } else {
        this.dialog.simpleDialog(
          'Store Id is not available for selected Category / Sub-Category.'
        );
      }
    }
  }
}
