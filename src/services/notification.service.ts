import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Notification {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification = signal<Notification | null>(null);

  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  error(message: string) {
    this.showNotification(message, 'Error');
  }

  success(message: string) {
    this.showNotification(message, 'Success');
  }
}