import { Injectable, signal } from '@angular/core';
import { ToastNotification } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _toasts = signal<ToastNotification[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(type: ToastNotification['type'], message: string, duration = 4000): void {
    const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, type, message, duration };

    this._toasts.update(current => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  success(message: string, duration = 4000): void {
    this.show('success', message, duration);
  }

  error(message: string, duration = 5000): void {
    this.show('error', message, duration);
  }

  warning(message: string, duration = 4500): void {
    this.show('warning', message, duration);
  }

  info(message: string, duration = 4000): void {
    this.show('info', message, duration);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(toast => toast.id !== id));
  }
}
