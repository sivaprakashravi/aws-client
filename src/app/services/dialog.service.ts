import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  timer = 2000;
  constructor(private snackBar: MatSnackBar) { }
  simpleDialog(message: string, duration?: number) {
    duration = duration ? duration : this.timer;
    this.snackBar.open(message, null, { duration });
  }
}
