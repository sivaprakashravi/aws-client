import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppService } from '../app.service';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(
    private loadingService: LoadingService,
    private http: HttpClient,
    private session: AppService
  ) {}

  async getProducts({
    category,
    subCategory,
    subCategory1,
    subCategory2,
    subCategory3,
    pageNo,
    limit,
    sku, asin
  }) {
    const url = `${this.url}products/processed/all`;
    let params = new HttpParams();
    params = params
      .set('category', category)
      .append('subCategory', subCategory)
      .append('pageNo', pageNo)
      .append('limit', limit);
    if (subCategory1) {
      params = params.append('subCategory1', subCategory1);
    }
    if (subCategory2) {
      params = params.append('subCategory2', subCategory2);
    }
    if (subCategory3) {
      params = params.append('subCategory3', subCategory3);
    }
    if (sku) {
      params = params.append('sku', sku);
    }
    if (asin) {
      params = params.append('asin', asin);
    }
    const request = this.http.get(url, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async downloadProducts({
    category,
    subCategory,
    subCategory1,
    subCategory2,
    subCategory3,
    storeId,
    categoryCode,
    sku,
    asin
  }) {
    const url = `${this.url}products/download`;
    let params = new HttpParams();
    params = params
      .set('category', category)
      .append('subCategory', subCategory)
      .append('storeId', storeId)
      .append('categoryCode', categoryCode);
    if (subCategory1) {
      params = params.append('subCategory1', subCategory1);
    }
    if (subCategory2) {
      params = params.append('subCategory2', subCategory2);
    }
    if (subCategory3) {
      params = params.append('subCategory3', subCategory3);
    }
    if (sku) {
      params = params.append('sku', sku);
    }
    if (asin) {
      params = params.append('asin', asin);
    }
    const request = this.http.get(url, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
