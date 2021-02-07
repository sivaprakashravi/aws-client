import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  private url = './assets/data/';

  constructor(public http: HttpClient) { }


  public errorCodes(): Observable<any> {
    return this.http.get(this.url + 'error-codes.json');
  }

}
