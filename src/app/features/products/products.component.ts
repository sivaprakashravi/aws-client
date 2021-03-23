import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JobSchedulerService } from 'src/app/services/backend/job-scheduler.service';
import { ProductService } from 'src/app/services/backend/product.service';
import * as _ from 'lodash';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  displayedColumns = [
    'asin',
    'label',
    'prodMinDesc',
    'rating',
    'brand',
    'description',
    'model',
    'price',
    'deliveryCharge'];
  filter: FormGroup;
  category: any = {};
  subCategory: any = {};
  categories = [];
  subCategories = [];
  products = [];
  rawProducts = [];
  totalProducts;
  pages = 0;
  activePage = 1;
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private router: ActivatedRoute,
    private dialog: DialogService,
    private productService: ProductService) {
    this.router.queryParams.subscribe(params => {
      this.category = params.category;
      this.subCategory = params.subCategory;
    });
  }

  async ngOnInit() {
    this.setFilter();
    await this.getCategories();
    this.applyParams();
  }

  applyParams() {
    if (this.category && this.subCategory) {
      const category = this.categories.find(c => c.nId === this.category);
      this.subCategories = category.subCategory;
      const subCategory = this.subCategories.find(c => c.nId === this.subCategory);
      this.filter = new FormGroup({
        category: new FormControl(category),
        subCategory: new FormControl(subCategory)
      });
      this.search();
    }
  }

  setFilter() {
    this.filter = new FormGroup({
      category: new FormControl(''),
      subCategory: new FormControl('')
    });
    this.subCategories = [];
  }

  async search(pageNo?) {
    const { category, subCategory } = this.filter.value;
    if (category.nId && subCategory.nId) {
      const filter = {
        category: category.nId,
        subCategory: subCategory.nId,
        limit: 25,
        pageNo: pageNo ? pageNo : 1
      };
      const { products, total } = await this.productService.getProducts(filter);
      this.products = products;
      this.pages = Math.ceil(total / 25);
      this.totalProducts = total;
      this.activePage = filter.pageNo;
    }
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
  }

  page(pageNo) {
    if (this.activePage !== pageNo) {
      this.search(pageNo);
    }
  }

  async download() {
    const { category, subCategory } = this.filter.value;
    if (category.nId && subCategory.nId) {
      const filter = {
        category: category.nId,
        subCategory: subCategory.nId,
        storeId: subCategory.nId ? subCategory.storeId : category.storeId
      };
      if (filter.storeId) {
        let products = await this.productService.downloadProducts(filter);
        products = products.map(p => _.omit(p, 'altImages'));
        this.convertTOCSV(products, `${category.name}-${subCategory.name}-${new Date().getTime()}`, '.csv');
      } else {
        this.dialog.simpleDialog('Store Id is not available for selected Category / Sub-Category.');
      }
    }
  }

  public convertTOCSV(data, fileName, type) {
    const items = data;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = items.map(row => header.map(fieldName => {
      const str = row[fieldName] ? row[fieldName].replace(/"/g, "'") : '';
      const formatted = JSON.stringify(str, replacer);
      return formatted;
    }).join(','));
    csv.unshift(header.join(','));
    const rowData = csv.join('\r\n');
    this.downloadFile(rowData, fileName, type);
  }

  public downloadFile(data, fileName, type) {
    const parsedResponse = data;
    const blob = new Blob(['\uFEFF', parsedResponse],
      { type: type === '.xls' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, `${new Date().getTime()}${type}`);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

}
