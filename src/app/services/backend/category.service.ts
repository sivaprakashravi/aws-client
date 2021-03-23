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

  async updateCategory({ category, subCategory, storeId }) {
    const url = `${this.url}category/update`;
    let params = new HttpParams();
    params = params.set('category', category).append('storeId', storeId);
    if (subCategory) {
      params = params.append('subCategory', subCategory);
    }
    const request = this.http.put(url, {}, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
