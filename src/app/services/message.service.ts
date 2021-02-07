import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  show = false;
  header;
  message;
  isConfirm = false;
  yes = {
    label: 'Yes',
    action: () => { }
  };
  no = {
    label: 'No',
    action: () => { }
  };
  xAction = () => { };
  constructor() { }

  createMessage(msg) {
    this.header = msg.header;
    this.message = msg.message;
    this.yes = msg.yes;
    this.no = msg.no;
    this.show = true;
    this.isConfirm = msg.isConfirm;
    this.xAction = msg.xAction;
  }

  close() {
    this.show = false;
    if (this.xAction) {
      this.xAction();
    }
  }
}
