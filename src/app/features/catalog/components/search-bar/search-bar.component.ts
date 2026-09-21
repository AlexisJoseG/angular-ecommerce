import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full max-w-xl mx-auto">
      <!-- Search Input Container -->
      <div class="relative flex items-center">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="search"
          [formControl]="searchControl"
          placeholder="Buscar productos por nombre (ej. Shoes, Classic, Wooden)..."
          class="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-brand-primary placeholder-slate-400 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent hover:border-slate-300"
          aria-label="Buscar productos"
        />

        @if (searchControl.value) {
          <button
            type="button"
            (click)="clearSearch()"
            class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            aria-label="Limpiar búsqueda"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
      </div>
    </div>
  `
})
export class SearchBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl('', { nonNullable: true });

  @Output() searchChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.searchChange.emit(value);
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
