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
    let params: any = {};
    const { shop_id, status, to_date, from_date } = d;
    const from = Math.round(new Date(from_date).getTime() / 1000);
    const to = Math.round(new Date(to_date).getTime() / 1000);
    const count = 10;
    const page = 1;
    params = new HttpParams();
    params = params.set('shop_id', shop_id.id).append('status', status.key).append('from', from).append('to', to)
    .append('count', count)
    .append('page', page);
    const request = this.http.get(url, { params });
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
