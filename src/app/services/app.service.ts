import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public dev = false;
  public overlay = false;
  public user;
  public activeRoute;
  public basicDetails;
  public navigation = [{
    name: 'Dashboard',
    route: 'dashboard',
  }, {
    name: 'Real Time Monitoring',
    route: 'real-time-monitoring'
  }, {
    name: 'Reports and Analysis',
    route: 'report-analysis',
    isBeta: true
  }, {
    name: 'Alerts and Notification',
    route: 'alert-notification'
  }, {
    name: 'Settings',
    route: '',
    class: 'mobile'
  }, {
    name: 'User Profile',
    route: '',
    class: 'mobile'
  }, {
    name: 'Logout',
    route: 'logout',
    class: 'mobile'
  }];
  constructor() { }

  public enableCover() {
    this.overlay = true;
  }

  public disableCover() {
    this.overlay = false;
  }

  public listPhantomDevices(floors) {
    const devices = [];
    floors.forEach((floor, i) => {
      if (floor && floor.DEVICE_DETAILS && floor.DEVICE_DETAILS.length) {
        const FLOOR_AREA = floor.FLOOR_AREA;
        const FLOOR_NO = floor.FLOOR_NO;
        const DEVICE_DETAILS = floor.DEVICE_DETAILS;
        DEVICE_DETAILS.map((d, j) => {
          d.FLOOR_AREA = FLOOR_AREA;
          d.FLOOR_NO = FLOOR_NO;
          d.id = `${i}${j}`;
          devices.push(d);
        });
      }
    });
    return devices;
  }
}

