import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async getNotifications(filter) {
    const url = `${this.url}notification/all`;
    let params: any = {};
    const { pageNo, limit } = filter;
    if (pageNo && limit) {
      params = new HttpParams();
      params = params.set('pageNo', pageNo).append('limit', limit);
    }
    const request = this.http.get(url, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async count() {
    const url = `${this.url}notification/count`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async update() {
    const url = `${this.url}notification/update/all`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
