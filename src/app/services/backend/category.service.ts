import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async updateStoreInfo({ category, subCategory, subCategory1, storeId }) {
    const url = `${this.url}category/store/update`;
    let params = new HttpParams();
    params = params.set('category', category).append('storeId', storeId);
    if (subCategory) {
      params = params.append('subCategory', subCategory);
    }
    if (subCategory1) {
      params = params.append('subCategory1', subCategory1);
    }
    const request = this.http.put(url, {}, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async updateCategory(category) {
    const url = `${this.url}category/update`;
    const request = this.http.put(url, category);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async addCategory(category) {
    const url = `${this.url}category/new`;
    const request = this.http.post(url, category);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
