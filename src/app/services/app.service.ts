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
  constructor() { }

  public enableCover() {
    this.overlay = true;
  }

  public disableCover() {
    this.overlay = false;
  }

  public convertTOCSV(data, fileName, type) {
    const items = data;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = items.map(row => header.map(fieldName => {
      row[fieldName] = row[fieldName] ? (row[fieldName]).toString() : null;
      // tslint:disable-next-line:quotemark
      const str = row[fieldName] ? row[fieldName].replace(/"/g, "'") : '';
      const formatted = JSON.stringify(str, replacer);
      return formatted;
    }).join(','));
    csv.unshift(header.join(','));
    const rowData = csv.join('\r\n');
    this.downloadFile(rowData, fileName, type);
  }

  public downloadFile(data, fileName, type) {
    const parsedResponse = data;
    const blob = new Blob(['\uFEFF', parsedResponse],
      { type: type === '.xls' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, `${new Date().getTime()}${type}`);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}

