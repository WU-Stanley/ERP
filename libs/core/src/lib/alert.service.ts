import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(private matSnackBar: MatSnackBar) {}

  showSuccess(
    message: string,
    classList: string[] = ['success-snackbar', 'rounded-md']
  ) {
    this.matSnackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: classList,
    });
  }

  showError(message: string) {
    this.matSnackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
