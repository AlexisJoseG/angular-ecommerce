import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationType } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0"
          [ngClass]="getToastClasses(toast.type)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <!-- Message -->
          <div class="flex-1 text-sm font-medium leading-snug">
            {{ toast.message }}
          </div>

          <!-- Close Button -->
          <button
            type="button"
            (click)="notificationService.dismiss(toast.id)"
            class="flex-shrink-0 text-white/80 hover:text-white hover:bg-black/10 p-1 rounded-lg transition-colors focus:outline-none"
            aria-label="Cerrar notificación"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class NotificationToastComponent {
  readonly notificationService = inject(NotificationService);

  getToastClasses(type: NotificationType): string {
    switch (type) {
      case 'success':
        return 'bg-[#2ECC71] text-white border-transparent shadow-lg';
      case 'error':
        return 'bg-red-600 text-white border-transparent shadow-lg';
      case 'warning':
        return 'bg-amber-500 text-white border-transparent shadow-lg';
      case 'info':
      default:
        return 'bg-slate-800 text-white border-transparent shadow-lg';
    }
  }
}
