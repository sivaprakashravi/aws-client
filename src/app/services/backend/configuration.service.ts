import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async getConfiguration() {
    const url = `${this.url}configuration/all`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async saveConfiguration(config) {
    const url = `${this.url}configuration`;
    const request = this.http.post(url, config);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async getUserConfiguration() {
    const url = `${this.url}configuration/user/all`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async saveUserConfiguration(config) {
    const url = `${this.url}configuration/user`;
    const request = this.http.post(url, config);
    const { data } = await this.loadingService.get(request);
    return data;
  }

  async refreshCategories() {
    const url = `${this.process}amazon/categories`;
    const request = this.http.get(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
