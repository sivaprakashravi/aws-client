import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/backend/configuration.service';
import { DbService } from 'src/app/services/backend/db.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-user-configuration',
  templateUrl: './user-configuration.component.html',
  styleUrls: ['./user-configuration.component.scss']
})
export class UserConfigurationComponent implements OnInit {
  interval: any = [];
  configuration = {
    orderInterval: '',
    priceStockInteval: 1
  };
  rawConfiguration: any = {
    orderInterval: '',
    priceStockInteval: 1
  };
  configurationForm: FormGroup = new FormGroup({
    orderInterval: new FormControl(''),
    priceStockInteval: new FormControl('')
  });
  constructor(private config: ConfigurationService, private dialog: DialogService, private db: DbService) { }

  ngOnInit() {
    this.getConfiguration();
    this.setIntervalList();
  }

  async getConfiguration() {
    const configuration = await this.config.getUserConfiguration();
    if (configuration) {
      this.configuration = configuration;
      this.rawConfiguration = configuration;
      this.setConfiguration(this.configuration);
    }
  }

  async saveConfiguration() {
    const configData = this.configurationForm.value;
    const configSaved = await this.config.saveUserConfiguration(configData);
    if (configSaved) {
      this.dialog.simpleDialog('User Configuration Updated');
    }
  }

  setConfiguration({ orderInterval, priceStockInteval }) {
    this.configurationForm = new FormGroup({
      orderInterval: new FormControl(orderInterval),
      active: new FormControl(false),
      priceStockInteval: new FormControl(priceStockInteval)
    });
  }

  setIntervalList() {
    this.interval = [{
      label: 'Once in a Day',
      id: '0 1 * * *'
    }, {
      label: 'Twice in a Day',
      id: '0 1,13 * * *'
    }, {
      label: 'Once in a Week',
      id: '0 0 * * 1'
    }, {
      label: 'Twice in a Week',
      id: '0 0 * * 1,4'
    }];
  }

}
