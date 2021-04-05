import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppHelperService {

  constructor() { }

  public validateEmail(email) {
    // tslint:disable-next-line:max-line-length
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(String(email).toLowerCase());
  }
}
