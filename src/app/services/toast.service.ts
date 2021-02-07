import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  show = false;
  type;
  message;
  constructor() { }
  createToast(tst) {
    const self = this;
    self.type = tst.type ? tst.type : '';
    self.message = tst.message;
    self.show = true;
    window.setTimeout(() => {
      self.show = false;
    }, 6000);
  }
}
