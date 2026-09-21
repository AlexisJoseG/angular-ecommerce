import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div class="w-20 h-20 rounded-2xl bg-brand-surface border border-brand-accent/10 flex items-center justify-center text-brand-accent mb-6 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      </div>

      <h3 class="text-xl font-bold text-brand-primary mb-2">{{ title }}</h3>
      <p class="text-slate-600 text-sm mb-6 leading-relaxed">{{ message }}</p>

      @if (showAction) {
        <button
          type="button"
          (click)="actionClick.emit()"
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-accent text-white font-medium text-sm shadow-md hover:bg-brand-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:ring-offset-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ actionText }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'No se encontraron productos';
  @Input() message = 'Intenta ajustar tus términos de búsqueda o filtros para encontrar lo que necesitas.';
  @Input() actionText = 'Restablecer filtros';
  @Input() showAction = true;

  @Output() actionClick = new EventEmitter<void>();
}
