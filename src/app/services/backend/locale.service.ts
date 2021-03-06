import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async getLocales() {
    const url = `${this.url}locale/all`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async addLocale(config) {
    const url = `${this.url}locale/add`;
    const request = this.http.post(url, config);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async deleteLocale(localeId) {
    const url = `${this.url}locale/delete`;
    let params = new HttpParams();
    params = params.set('localeId', localeId);
    const request = this.http.delete(url, { params });
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async applyLocale(config) {
    const url = `${this.url}locale/apply`;
    const request = this.http.post(url, config);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
