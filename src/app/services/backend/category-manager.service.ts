import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagerService {
  url = `${environment.URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  scrapCaterory(category) {
    if (category) {
      const url = `${this.url}amazon/scrapper`;
      let params = new HttpParams();
      params = params.set('key', category);
      const request = this.http.get(url, { params });
      const response = this.loadingService.get(request);
      return response;
    }
  }

  categories() {
    const url = `${this.url}amazon/categories`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }

  jobStatus() {
    const url = `${this.url}amazon/jobs`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }
}
