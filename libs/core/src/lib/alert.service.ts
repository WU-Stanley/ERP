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

  showError(
    message: string,
    classList: string[] = ['error-snackbar', 'rounded-md']
  ) {
    this.matSnackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: classList,
    });
  }

  confirm(
    message: string,
    action = 'Confirm',
    classList: string[] = ['warning-snackbar', 'rounded-md']
  ): Promise<boolean> {
    const snackBarRef = this.matSnackBar.open(message, action, {
      duration: 8000,
      panelClass: classList,
    });

    return new Promise<boolean>((resolve) => {
      let resolved = false;
      snackBarRef.onAction().subscribe(() => {
        resolved = true;
        resolve(true);
      });
      snackBarRef.afterDismissed().subscribe(() => {
        if (!resolved) {
          resolve(false);
        }
      });
    });
  }
}
