import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { JobSchedulerService } from "src/app/services/backend/job-scheduler.service";
import { ProductService } from "src/app/services/backend/product.service";
import * as _ from "lodash";
import { DialogService } from "src/app/services/dialog.service";
import { AppService } from "src/app/services/app.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  displayedColumns = [
    "asin",
    "sku",
    "label",
    "item_dimensions_weight",
    "price",
    "link",
  ];
  filter: FormGroup;
  category: any = {};
  subCategory: any = {};
  subCategory1: any = {};
  categories = [];
  subCategories = [];
  subCategories1 = [];
  products = [];
  rawProducts = [];
  totalProducts;
  pages = 0;
  activePage = 1;
  limit = 10;
  limits = [10,20,30,40,50];
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
      const subCategory1 = this.subCategories1.find(
        (c) => c.nId === this.subCategory1
      );
      this.filter = new FormGroup({
        category: new FormControl(category),
        subCategory: new FormControl(subCategory),
        subCategory1: new FormControl(subCategory1),
      });
      this.search();
    }
  }

  setFilter() {
    this.filter = new FormGroup({
      category: new FormControl(""),
      subCategory: new FormControl(""),
      subCategory1: new FormControl(""),
    });
    this.subCategories = [];
    this.subCategories1 = [];
  }

  async search(pageNo?) {
    const { category, subCategory, subCategory1 } = this.filter.value;
    if (category.nId && subCategory.nId) {
      const filter: any = {
        category: category.nId,
        subCategory: subCategory.nId,
        limit: this.limit,
        pageNo: pageNo ? pageNo : 1,
      };
      if (subCategory1.nId || subCategory1.node) {
        filter.subCategory1 = subCategory1.nId
          ? subCategory1.nId
          : subCategory1.node;
      }
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
    this.subCategories = [];
    this.filter.value.subCategory = null;
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
  }

  updateSubCategory1({ value }) {
    this.subCategories1 = [];
    this.filter.value.subCategory1 = null;
    if (value && value.subCategory) {
      this.subCategories1 = value.subCategory;
    }
  }

  page(pageNo) {
    if (this.activePage !== pageNo) {
      this.search(pageNo);
    }
  }

  setPage() {
    const {limit, activePage, pages} = this;
    this.pageNos = [];
    if(activePage > 2) {
      this.pageNos.push(activePage - 2);
    }
    if(activePage > 1) {
      this.pageNos.push(activePage - 1);
    }
    this.pageNos.push(activePage);
    if(activePage < pages - 1) {
      this.pageNos.push(activePage + 1);
    }
    if(activePage < pages - 2) {
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
        products = products.map((p) => _.omit(p, "altImages"));
        this.appService.convertTOCSV(
          products,
          `${category.name}-${subCategory.name}-${new Date().getTime()}`,
          ".csv"
        );
      } else {
        this.dialog.simpleDialog(
          "Store Id is not available for selected Category / Sub-Category."
        );
      }
    }
  }
}
