import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ConfigurationService } from 'src/app/services/backend/configuration.service';
import { DbService } from 'src/app/services/backend/db.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  configuration = {
    proxies: '',
    host: '',
    maxRange: '',
    save: 1,
    active: false,
    categoryJobSystem: 1
  };
  rawConfiguration: any = {
    proxies: '',
    host: '',
    maxRange: '',
    save: 1,
    active: false,
    categoryJobSystem: 1
  };
  configurationForm: FormGroup = new FormGroup({
    proxies: new FormControl(''),
    host: new FormControl(''),
    maxRange: new FormControl(''),
    save: new FormControl(''),
    active: new FormControl(false),
    categoryJobSystem: new FormControl('')
  });
  constructor(
    private config: ConfigurationService,
    private dialog: DialogService,
    private db: DbService,
    public app: AppService) { }

  ngOnInit() {
    this.getConfiguration();
  }

  async getConfiguration() {
    const configuration = await this.config.getConfiguration();
    if (configuration) {
      this.configuration = configuration;
      this.rawConfiguration = configuration;
      this.setConfiguration(this.configuration);
    }
  }

  async saveConfiguration() {
    const configData = this.configurationForm.value;
    const configSaved = await this.config.saveConfiguration(configData);
    if (configSaved) {
      this.dialog.simpleDialog('Configuration Updated');
    }
  }

  setConfiguration({ proxies, host, maxRange, save, categoryJobSystem, active }) {
    this.configurationForm = new FormGroup({
      proxies: new FormControl(proxies),
      host: new FormControl(host),
      maxRange: new FormControl(maxRange),
      save: new FormControl(save),
      active: new FormControl(active),
      categoryJobSystem: new FormControl(categoryJobSystem)
    });
  }

  async suspendApplication() {
    const configData = this.rawConfiguration;
    configData.active = !configData.active;
    const configSaved = await this.config.saveConfiguration(configData);
    if (configSaved) {
      this.dialog.simpleDialog('Configuration Updated');
    }
  }

  async refreshCategories() {
    const system = this.configuration.categoryJobSystem;
    if (system) {
      const cat = await this.config.refreshCategories(system);
      this.dialog.simpleDialog(cat);
    }
  }

  async clearDBs() {
    const deleted = await this.db.deleteDBs();
    this.dialog.simpleDialog('All Documents removed Except Categories and Configuration.');
  }

}
