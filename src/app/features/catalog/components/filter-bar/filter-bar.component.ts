import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../core/models/category.model';
import { SortOption } from '../../../../core/models/filter-params.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-4 py-2">
      <!-- Category Chips / Horizontal scrollable filter -->
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto" role="tablist" aria-label="Filtro por categorías">
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="selectedCategoryId === null"
            (click)="selectCategory(null)"
            class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-brand-accent"
            [ngClass]="{
              'bg-brand-primary text-white border-brand-primary shadow-sm': selectedCategoryId === null,
              'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300': selectedCategoryId !== null
            }"
          >
            Todas las categorías
          </button>

          @for (category of categories; track category.id) {
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="selectedCategoryId === category.id"
              (click)="selectCategory(category.id)"
              class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-brand-accent"
              [ngClass]="{
                'bg-brand-primary text-white border-brand-primary shadow-sm': selectedCategoryId === category.id,
                'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300': selectedCategoryId !== category.id
              }"
            >
              {{ category.name }}
            </button>
          }
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-2 ml-auto">
          <label for="sort-select" class="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Ordenar por:
          </label>
          <select
            id="sort-select"
            [value]="selectedSort"
            (change)="onSortChange($event)"
            class="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-brand-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent"
          >
            <option value="default">Relevancia</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre: A - Z</option>
            <option value="name-desc">Nombre: Z - A</option>
          </select>
        </div>
      </div>
    </div>
  `
})
export class FilterBarComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Input() selectedSort: SortOption = 'default';

  @Output() categorySelect = new EventEmitter<number | null>();
  @Output() sortChange = new EventEmitter<SortOption>();

  selectCategory(categoryId: number | null): void {
    this.categorySelect.emit(categoryId);
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortChange.emit(value);
  }
}
