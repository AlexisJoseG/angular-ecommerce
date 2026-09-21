import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0"
          [ngClass]="{
            'bg-brand-primary/95 text-white border-brand-accent/40': toast.type === 'info',
            'bg-emerald-950/95 text-emerald-100 border-emerald-500/40': toast.type === 'success',
            'bg-red-950/95 text-red-100 border-red-500/40': toast.type === 'error',
            'bg-amber-950/95 text-amber-100 border-amber-500/40': toast.type === 'warning'
          }"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-brand-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            class="flex-shrink-0 text-slate-400 hover:text-white transition-colors focus:outline-none"
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
}
