import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfigurationService } from 'src/app/services/backend/configuration.service';
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
    save: 1
  };
  configurationForm: FormGroup = new FormGroup({
    proxies: new FormControl(''),
    host: new FormControl(''),
    maxRange: new FormControl(''),
    save: new FormControl('')
 });
  constructor(private config: ConfigurationService, private dialog: DialogService) { }

  async ngOnInit() {
    const configuration = await this.config.getConfiguration();
    this.configuration = configuration[0];
    this.setConfiguration(this.configuration);
  }

  async saveConfiguration() {
    const configData = this.configurationForm.value;
    const configSaved = await this.config.saveConfiguration(configData);
    this.dialog.simpleDialog('Configuration Updated');
  }

  setConfiguration({ proxies, host, maxRange, save }) {
    this.configurationForm = new FormGroup({
      proxies: new FormControl(proxies),
      host: new FormControl(host),
      maxRange: new FormControl(maxRange),
      save: new FormControl(save)
    });
  }

  async refreshCategories() {
    const cat = await this.config.refreshCategories();
    this.dialog.simpleDialog(cat);
  }

}
