import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { JobSchedulerService } from "src/app/services/backend/job-scheduler.service";
import { LocaleService } from "src/app/services/backend/locale.service";
import { DialogService } from "src/app/services/dialog.service";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";

@Component({
  selector: "app-locale-setup",
  templateUrl: "./locale-setup.component.html",
  styleUrls: ["./locale-setup.component.scss"],
})
export class LocaleSetupComponent implements OnInit {
  displayedColumnsList = [
    { key: "name", label: "Name" },
    { key: "beaCukai", label: "BEA CUKAI %" },
    { key: "ccpHAWB", label: "Custom Clearance / HAWB" },
    { key: "ccpKG", label: "Custom Clearance / KG" },
    { key: "freightDC", label: "freight D->C" },
    { key: "freightUD", label: "freight U->D" },
    { key: "handlingCharges", label: "Handling Charges" },
    { key: "markUp", label: "Mark Up %" },
    { key: "packingCost", label: "Packing Cost" },
    { key: "pfComission", label: "PF Comission %" },
    { key: "ppn", label: "PPN %" },
    { key: "sensitiveCargo", label: "Sensitive Cargo" },
    { key: "variationFactor", label: "Variation Factor" },
    { key: "volumetricWtFactor", label: "Volumetric WtFactor" },
    { key: "ccv", label: "Currency Conversion value" },
    { key: "lactions", label: "" },
  ];
  displayedColumns: string[] = [];
  displayedApplyColumns: string[] = [
    "category",
    "subCategory",
    "recursive",
    "locale",
    "count",
    "actions",
  ];
  formula: FormGroup;
  newFormula: FormGroup;
  values = ["%", "value"];
  locales = [];
  categories = [];
  subCategories = [];
  subCategories1 = [];
  subCategories2 = [];
  subCategories3 = [];
  localeUpdates = [];
  addLocale = true;
  toggleFormula = true;
  toggleApplyFormula = true;
  constructor(
    private localeService: LocaleService,
    private dialog: DialogService,
    private router: Router,
    private jobSchedulerService: JobSchedulerService,
    public app: AppService
  ) {}

  async ngOnInit() {
    this.displayedColumns = this.displayedColumnsList.map((d) => d.key);
    this.reset();
    this.resetNewFormula();
    this.listLocales();
    await this.getCategories();
    this.getLocales();
  }

  async getCategories() {
    const { data } = await this.jobSchedulerService.categories();
    data.forEach((d) => (d.count = 0));
    this.categories = data;
  }

  updateSubCategory({ value }) {
    this.subCategories1 = [];
    this.subCategories2 = [];
    this.subCategories3 = [];
    if (value && value.subCategory) {
      this.subCategories = value.subCategory;
    }
  }

  updateSubCategory1({ value }) {
    this.subCategories2 = [];
    this.subCategories3 = [];
    this.subCategories1 = value.subCategory;
  }

  updateSubCategory2({ value }) {
    this.subCategories3 = [];
    this.subCategories2 = value.subCategory;
  }

  updateSubCategory3({ value }) {
    this.subCategories3 = value.subCategory;
  }

  reset() {
    this.formula = new FormGroup({
      name: new FormControl("", [Validators.required]),
      variationFactor: new FormControl("", [Validators.required]),
      volumetricWtFactor: new FormControl("", [Validators.required]),
      packingCost: new FormControl("", [Validators.required]),
      freightUD: new FormControl("", [Validators.required]),
      freightDC: new FormControl("", [Validators.required]),
      ccpKG: new FormControl("", [Validators.required]),
      ccpHAWB: new FormControl("", [Validators.required]),
      sensitiveCargo: new FormControl("", [Validators.required]),
      handlingCharges: new FormControl("", [Validators.required]),
      markUp: new FormControl("", [Validators.required]),
      beaCukai: new FormControl("", [Validators.required]),
      pfComission: new FormControl("", [Validators.required]),
      ppn: new FormControl("", [Validators.required]),
      ccv: new FormControl("", [Validators.required]),
    });
  }

  resetNewFormula() {
    this.newFormula = new FormGroup({
      category: new FormControl(""),
      subCategory: new FormControl(""),
      subCategory1: new FormControl(""),
      subCategory2: new FormControl(""),
      subCategory3: new FormControl(""),
      locale: new FormControl(""),
    });
  }

  numberOnly(evt) {
    const theEvent = evt || window.event;
    let key = null;
    // Handle paste
    if (theEvent.type === "paste") {
      key = theEvent.clipboardData.getData("text/plain");
    } else {
      // Handle key press
      key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) {
        theEvent.preventDefault();
      }
    }
  }

  async listLocales() {
    const locales = await this.localeService.getLocales();
    this.locales = locales;
  }

  async add() {
    const added = await this.localeService.addLocale(this.formula.value);
    if (added) {
      this.dialog.simpleDialog("Locale Added");
      this.listLocales();
      this.addLocale = false;
    }
  }

  async removeLocale({ localeId }) {
    if (localeId) {
      const deleted = await this.localeService.deleteLocale(localeId);
      if (deleted) {
        this.dialog.simpleDialog("Locale Deleted");
        this.listLocales();
      }
    }
  }

  async apply(method, isRecursive?, row?) {
    let filter: any = {};
    const catloop = [1, 2, 3];
    if (method === "applyOnly" || method === "applyLog") {
      filter = row;
      filter.category = filter.category.nId;
      filter.subCategory = filter.subCategory.nId;
      catloop.forEach((c) => {
        if (filter && filter[`subCategory${c}`]) {
          filter[`subCategory${c}`] = filter[`subCategory${c}`].nId
            ? filter[`subCategory${c}`].nId
            : filter[`subCategory${c}`].node;
        }
      });
      filter.status = "applied";
      filter.noSave = true;
    } else {
      let category = this.newFormula.value.category;
      category = category.nId;
      let subCategory = this.newFormula.value.subCategory;
      subCategory = subCategory.nId;
      let subCategory1 = this.newFormula.value.subCategory1;
      subCategory1 = subCategory1.nId;
      let subCategory2 = this.newFormula.value.subCategory2;
      subCategory2 = subCategory2.nId;
      let subCategory3 = this.newFormula.value.subCategory3;
      subCategory3 = subCategory3.nId;
      filter = {
        locale: _.pick(this.newFormula.value.locale, ["localeId", "name"]),
        recursive: isRecursive ? true : false,
        category,
        subCategory,
        subCategory1,
        subCategory2,
        subCategory3,
      };
    }
    if (method === "addLog") {
      filter.status = "saved";
    }
    if (method === "applyLog") {
      filter.recursive = true;
    }
    if (method === "applyOnly" || method === "applyLog") {
      filter.status = "applied";
      method = "applyLog";
    }
    const locale = await this.localeService[method](filter);
    this.dialog.simpleDialog(locale.message);
    this.resetNewFormula();
    this.getLocales();
  }

  async getLocales() {
    const logs = await this.localeService.getLocaleLogs();
    logs.forEach((l) => {
      l.category = this.categories.find((c) => c.nId === l.category);
      l.subCategory = l.category.subCategory.find(
        (c) => c.nId === l.subCategory
      );
      if (l.subCategory1) {
        l.subCategory1 = l.subCategory.subCategory.find(
          (c) => c.nId === l.subCategory1
        );
      }
    });
    this.localeUpdates = logs;
  }

  async archiveLocale(locale: any) {
    const logs = await this.localeService.archiveLog(locale.log);
    this.dialog.simpleDialog(
      logs ? "Log Archived Successfully!" : "Error during Archive!!"
    );
    this.getLocales();
  }

  async refresh(locale: any) {
    const { log, category, subCategory } = locale;
    const logs = await this.localeService.refresh(
      log,
      category.nId,
      subCategory.nId
    );
    this.dialog.simpleDialog(
      logs
        ? "Product Count Updated Successfully!"
        : "Error during Count Update!!"
    );
    this.getLocales();
  }

  async navToPdts({ category, subCategory, subCategory1, count }) {
    if (count && category && subCategory) {
      const queryParams: any = {
        category: category.nId,
        subCategory: subCategory.nId,
      };
      if (subCategory1) {
        queryParams.subCategory1 = subCategory1.nId;
      }
      this.router.navigate(["products"], { queryParams });
    }
  }

  async recursiveChange(locale) {
    const rec = await this.localeService.recursiveLog(locale.log);
    this.dialog.simpleDialog(
      rec
        ? "Recursive updated Successfully!"
        : "Something went wrong. Try after sometime!!"
    );
    this.getLocales();
  }

  async cloneLocale(row) {
    const clone = _.omit(row, ['_id', 'createdBy', 'createdOn', 'localeId', 'active']);
    clone.name = `${clone.name}-CLONE`;
    this.formula.setValue(clone);
  }

  async fetchScrapCount() {
    
  }
}
