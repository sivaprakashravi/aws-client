import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async orders(d) {
    const url = `${this.url}orders/all`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async statuses() {
    const url = `${this.url}orders/statuses`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
