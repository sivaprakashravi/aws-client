import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class JobSchedulerService {
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

  scrappedData() {
    const url = `${this.url}amazon/data`;
    const request = this.http.get(url);
    const response = this.loadingService.get(request);
    return response;
  }

  categories() {
    const url = `${this.url}category/all`;
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

  async jobs() {
    const url = `${this.url}job/all`;
    const request = this.http.get(url);
    const response = await this.loadingService.get(request, false, true);
    return response.data;
  }

  addJob(data) {
    const url = `${this.url}job/create`;
    const request = this.http.post(url, data);
    const response = this.loadingService.get(request);
    return response;
  }

  remove(scheduleId) {
    const url = `${this.url}job/delete`;
    let params = new HttpParams();
    params = params.set('scheduleId', scheduleId);
    const request = this.http.delete(url, { params });
    const response = this.loadingService.get(request);
    return response;
  }

  pause({scheduleId}) {
    const url = `${this.url}job/pause`;
    let params = new HttpParams();
    params = params.set('scheduleId', scheduleId);
    const request = this.http.get(url, { params });
    const response = this.loadingService.get(request);
    return response;
  }

  recursive({scheduleId}) {
    const url = `${this.url}job/recursive`;
    let params = new HttpParams();
    params = params.set('scheduleId', scheduleId);
    const request = this.http.get(url, { params });
    const response = this.loadingService.get(request);
    return response;
  }

  prime({scheduleId}) {
    const url = `${this.url}job/prime`;
    let params = new HttpParams();
    params = params.set('scheduleId', scheduleId);
    const request = this.http.get(url, { params });
    const response = this.loadingService.get(request);
    return response;
  }

}
