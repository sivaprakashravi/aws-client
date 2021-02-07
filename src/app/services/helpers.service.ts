import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor() { }


  public convertTOCSV(data, fileName, type) {
    const items = data;
    const replacer = (key, value) => value === null ? '' : value;
    const header = Object.keys(items[0]);
    const csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const rowData = csv.join('\r\n');
    this.downloadFile(rowData, fileName, type);
  }

  public downloadFile(data, fileName, type) {
    const parsedResponse = data;
    const blob = new Blob(['\ufeff', parsedResponse],
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
