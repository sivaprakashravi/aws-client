/**
 * @author [SBA5COB] Sivaprakasharavi Baskaran
 * @email [Sivaprakasharavi.Baskaran@in.bosch.com]
 * @create date 2019-03-14 23:59:43
 * @modify date 2019-03-14 23:59:43
 * @desc [Service loader, enable/disable loading overlay for service requests.]
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastService } from './toast.service';
import { MessageService } from './message.service';
import { JsonService } from './json.service';
import { SessionService } from './auth/session.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpLoaderService implements OnDestroy {
  enabled = false;
  counter = 0;
  error: any = {};
  timeout = 10; // in minutes
  dataHolder: Array<any> = [];
  subscribed: any = {};
  errorCodes;
  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private message: MessageService,
    private json: JsonService,
    private session: SessionService,
    private router: Router) { }
  // show loading overlay
  show() {
    this.enabled = true;
  }
  // hide loading overlay
  hide() {
    this.enabled = false;
    this.counter = 0;
  }
  // service opened
  open() {
    this.counter = this.counter + 1;
    this.show();
  }
  // service closed
  done() {
    this.counter = this.counter - 1;
    if (this.counter <= 0) {
      this.hide();
    }
  }
  // service handler
  async get(request: Observable<any>, noValidation?) {
    const self = this;
    const timed = timeout(self.timeout * 60 * 1000);
    console.log(timed);
    let response;
    if (noValidation || this.session.validSession()) {
      self.open();
      await request.pipe(timed, catchError((et) => {
        self.requestCancel(et);
        return of(null);
      })).toPromise().then((success) => {
        response = success;
        self.done();
      }, (error) => {
        self.done();
        if (error.name === 'HttpErrorResponse') {
          self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
            self.error = er.find(e => e.errorCode === error.status);
            if (error.message) {
              self.error.message = error.message;
            }
          });
        } else {
          self.error = error.error;
        }
        this.showError(self.error);
      });
      return response;
    } else {
      self.router.navigate(['logout']);
    }
  }
  // service handler
  async httpGet(url: string, params?) {
    const self = this;
    let response;
    const retrivedData = self.dataHolder.find(data => data.url === url);
    if (retrivedData) {
      response = retrivedData.response;
    } else {
      const request = self.http.get(url, params);
      // self.open();
      await request.pipe(
        timeout(self.timeout * 60 * 1000),
        catchError((et) => {
          self.requestCancel(et);
          return of(null);
        })
      ).toPromise().then((success) => {
        response = success;
        self.done();
        const dataObject = {
          url,
          response: success
        };
        self.dataHolder.push(dataObject);
      }, (error) => {
        self.done();
        if (error.name === 'HttpErrorResponse') {
          self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
            self.error = er.find(e => e.errorCode === error.status);
          });
          if (error.message) {
            self.error.message = error.message;
          }
        } else {
          self.error = error.error;
        }
        this.showError(self.error);
      });
    }
    return response;
  }

  public resetDataHolder() {
    this.dataHolder = [];
  }

  requestCancel({ status, statusText, error }) {
    const self = this;
    self.done();
    self.subscribed.errorCodes = self.json.errorCodes().subscribe(er => {
      self.error = er.find(e => e.errorCode === (status ? status : 550));
      if (error && error.message) {
        self.error.message = error.message;
      }
      // self.error.message = statusText ? statusText : self.error.message;
      self.showError(self.error);
    });
  }

  showError(error) {
    if (error) {
      this.message.createMessage({
        header: `Code: ${error.errorCode}`,
        message: error.message,
        yes: {
          label: 'Ok',
          action: () => {
            this.message.close();
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    for (const sub in this.subscribed) {
      if (this.subscribed[sub]) {
        this.subscribed[sub].unsubscribe();
      }
    }
  }
}
