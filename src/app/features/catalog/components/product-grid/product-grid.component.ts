import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SkeletonCardComponent } from '../../../../shared/components/skeleton-card/skeleton-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SkeletonCardComponent,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-label="Lista de productos" class="w-full">
      @if (loading) {
        <!-- Skeleton Grid During Loading -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (item of skeletonArray; track $index) {
            <app-skeleton-card />
          }
        </div>
      } @else {
        <!-- Main Products Grid with Defer & Control Flow -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (product of products; track product.id) {
            @defer (on viewport; prefetch on idle) {
              <app-product-card [product]="product" />
            } @placeholder {
              <app-skeleton-card />
            }
          } @empty {
            <div class="col-span-full">
              <app-empty-state
                [title]="emptyTitle"
                [message]="emptyMessage"
                (actionClick)="resetFilters.emit()"
              />
            </div>
          }
        </div>
      }
    </section>
  `
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() emptyTitle = 'No se encontraron productos';
  @Input() emptyMessage = 'No hay artículos que coincidan con los criterios de búsqueda o filtros seleccionados.';

  @Output() resetFilters = new EventEmitter<void>();

  readonly skeletonArray = Array.from({ length: 8 }, (_, i) => i);
}
