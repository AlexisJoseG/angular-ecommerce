import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { SortOption } from '../../../core/models/filter-params.model';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ProductGridComponent } from '../components/product-grid/product-grid.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    FilterBarComponent,
    ProductGridComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Hero / Header Section -->
      <section class="text-center max-w-3xl mx-auto space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
          Explora Nuestra Colección
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-brand-primary tracking-tight">
          Catálogo de Productos Platzi
        </h1>
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
          Diseñado con arquitectura enterprise de Angular 19, reactividad basada en Signals y consumo en tiempo real de la Platzi Fake Store API.
        </p>

        <!-- Search Bar -->
        <div class="pt-4">
          <app-search-bar (searchChange)="onSearchQueryChange($event)" />
        </div>
      </section>

      <!-- Filter Bar -->
      <section class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <app-filter-bar
          [categories]="categories()"
          [selectedCategoryId]="selectedCategoryId()"
          [selectedSort]="selectedSort()"
          (categorySelect)="onCategoryChange($event)"
          (sortChange)="onSortChange($event)"
        />
      </section>

      <!-- Products Summary & Count -->
      <div class="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>Mostrando {{ sortedProducts().length }} productos disponibles</span>
        @if (searchQuery() || selectedCategoryId() !== null) {
          <button
            type="button"
            (click)="resetAllFilters()"
            class="text-brand-accent hover:underline focus:outline-none"
          >
            Limpiar todos los filtros
          </button>
        }
      </div>

      <!-- Product Grid with Loading & Empty State -->
      <app-product-grid
        [products]="sortedProducts()"
        [loading]="loading()"
        (resetFilters)="resetAllFilters()"
      />

      <!-- Pagination Controls -->
      @if (!loading() && sortedProducts().length > 0 && !searchQuery()) {
        <nav aria-label="Paginación del catálogo" class="flex items-center justify-center gap-3 pt-6 pb-12">
          <button
            type="button"
            [disabled]="currentPage() === 1"
            (click)="previousPage()"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
            [ngClass]="{
              'bg-white text-brand-primary border-slate-200 hover:bg-slate-100 shadow-sm': currentPage() > 1,
              'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed': currentPage() === 1
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <span class="px-4 py-2 rounded-xl text-xs font-bold bg-brand-surface text-brand-primary border border-brand-accent/20">
            Página {{ currentPage() }}
          </span>

          <button
            type="button"
            [disabled]="sortedProducts().length < pageSize"
            (click)="nextPage()"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
            [ngClass]="{
              'bg-white text-brand-primary border-slate-200 hover:bg-slate-100 shadow-sm': sortedProducts().length === pageSize,
              'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed': sortedProducts().length < pageSize
            }"
          >
            Siguiente
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      }
    </main>
  `
})
export class CatalogPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly notificationService = inject(NotificationService);

  readonly pageSize = 12;

  // Signals de estado
  readonly rawProducts = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal<boolean>(true);
  readonly searchQuery = signal<string>('');
  readonly selectedCategoryId = signal<number | null>(null);
  readonly selectedSort = signal<SortOption>('default');
  readonly currentPage = signal<number>(1);

  // Computeds derivados
  readonly sortedProducts = computed(() => {
    const list = [...this.rawProducts()];
    const sort = this.selectedSort();

    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return list;
    }
  });

  ngOnInit(): void {
    this.loadCategories();
    this.fetchProducts();
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories.slice(0, 8));
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  fetchProducts(): void {
    this.loading.set(true);

    const query = this.searchQuery();
    const categoryId = this.selectedCategoryId();
    const page = this.currentPage();
    const offset = (page - 1) * this.pageSize;

    if (query) {
      this.catalogService.searchProducts(query).subscribe({
        next: (products) => {
          let filtered = products;
          if (categoryId !== null) {
            filtered = products.filter(p => p.category?.id === categoryId);
          }
          this.rawProducts.set(filtered);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else if (categoryId !== null) {
      this.catalogService.getProductsByCategory(categoryId, offset, this.pageSize).subscribe({
        next: (products) => {
          this.rawProducts.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.catalogService.getProducts({ offset, limit: this.pageSize }).subscribe({
        next: (products) => {
          this.rawProducts.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.fetchProducts();
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.currentPage.set(1);
    this.fetchProducts();
  }

  onSortChange(sort: SortOption): void {
    this.selectedSort.set(sort);
  }

  nextPage(): void {
    this.currentPage.update(p => p + 1);
    this.fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.fetchProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  resetAllFilters(): void {
    this.searchQuery.set('');
    this.selectedCategoryId.set(null);
    this.selectedSort.set('default');
    this.currentPage.set(1);
    this.fetchProducts();
  }
}
