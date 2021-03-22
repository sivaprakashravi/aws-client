import { Injectable } from '@angular/core';
import { environment } from '.././../../environments/environment';
import { LoadingService } from '../loading.service';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url = `${environment.URL}`;
  process = `${environment.PROCESS_URL}`;
  constructor(private loadingService: LoadingService, private http: HttpClient, private session: AppService) { }

  async deleteDBs() {
    const url = `${this.url}db/empty`;
    const request = this.http.delete(url);
    const { data } = await this.loadingService.get(request);
    return data;
  }
}
