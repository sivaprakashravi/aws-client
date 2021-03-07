import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ecom Automation';
  date = new Date();
  navigation = [{
    name: 'Schedule',
    route: 'job-scheduler'
  }, {
    name: 'Locale',
    route: 'locale-setup'
  }, {
    name: 'Products',
    route: 'products'
  }];
}
