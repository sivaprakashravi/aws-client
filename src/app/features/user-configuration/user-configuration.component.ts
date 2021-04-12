import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppHelperService } from 'src/app/helpers/app-helper.service';
import { SessionService } from 'src/app/services/auth/session.service';
import { ConfigurationService } from 'src/app/services/backend/configuration.service';
import { UsersService } from 'src/app/services/backend/user.service';
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
  user: FormGroup;
  displayedColumnsUsers = [
    'order_id',
    'invoice_ref_num',
    'create_time',
    'amount',
    'is_cod_mitra',
    'status'];
  role: FormGroup;
  roles = [];
  users = [];
  constructor(
    private config: ConfigurationService,
    private dialog: DialogService,
    private appHelper: AppHelperService,
    private userService: UsersService) { }

  async ngOnInit() {
    this.getConfiguration();
    this.setIntervalList();
    this.setUser();
    this.setRole();
    await this.getRoles();
    await this.getUsers();
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

  setUser() {
    this.user = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      phone: new FormControl(),
      role: new FormControl()
    });
  }

  setRole() {
    this.role = new FormGroup({
      name: new FormControl()
    });
  }

  async getUsers() {
    const { data } = await this.userService.getUsers();
    data.forEach(d => {
      if (d.role) {
        const selectedRole = this.roles.find(r => r.roleId === d.role);
        d.roleName = selectedRole.name;
      }
    });
    this.users = data;
  }

  async getRoles() {
    const { data } = await this.userService.getRoles();
    this.roles = data.filter(d => d.roleId !== 1);
  }

  async saveUser() {
    const self = this;
    const session = this.user.value;
    const validEmail = self.appHelper.validateEmail(session.email);
    if (validEmail) {
      session.email = session.email.toUpperCase();
      const user = await self.userService.register(session);
      if (user) {
        this.dialog.simpleDialog('User Added Successfully!');
        this.setUser();
        this.getUsers();
      }
    } else {
      this.dialog.simpleDialog('Email Id is invalid');
    }
  }

  async saveRole() {
    const self = this;
    const roleValue = this.role.value;
    const role = await self.userService.addRole(roleValue);
    if (role) {
      this.dialog.simpleDialog('Role Added Successfully!');
      this.setRole();
    }
  }

  async updateRole(role) {
    const self = this;
    await self.userService.updateRole(role);
    await self.getRoles();
  }

  async deleteRole(role) {
    const self = this;
    const deleted = await self.userService.deleteRole(role);
    if (deleted) {
      this.dialog.simpleDialog('Role Deleted Successfully!');
      await this.getRoles();
    }
  }
}
