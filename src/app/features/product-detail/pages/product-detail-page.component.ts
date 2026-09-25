import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { PriceFormatPipe } from '../../../shared/pipes/price-format.pipe';
import { SanitizeImagePipe } from '../../../shared/pipes/sanitize-image.pipe';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PriceFormatPipe,
    SanitizeImagePipe,
    ImageFallbackDirective,
    EmptyStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Breadcrumb & Back button -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <a routerLink="/catalog" class="hover:text-brand-accent transition-colors flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al catálogo
        </a>
        <span>/</span>
        <span class="text-brand-primary truncate max-w-xs">
          {{ product()?.title || 'Detalle del producto' }}
        </span>
      </nav>

      @if (loading()) {
        <!-- Skeleton Detail Loading -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm animate-pulse">
          <div class="space-y-4">
            <div class="aspect-[4/3] w-full bg-slate-200 rounded-2xl"></div>
            <div class="flex gap-3">
              <div class="w-20 h-20 bg-slate-200 rounded-xl"></div>
              <div class="w-20 h-20 bg-slate-200 rounded-xl"></div>
              <div class="w-20 h-20 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
          <div class="space-y-5">
            <div class="h-6 w-24 bg-slate-200 rounded-full"></div>
            <div class="h-9 w-3/4 bg-slate-200 rounded-xl"></div>
            <div class="h-8 w-32 bg-slate-200 rounded-lg"></div>
            <div class="space-y-2 pt-4">
              <div class="h-4 w-full bg-slate-100 rounded"></div>
              <div class="h-4 w-5/6 bg-slate-100 rounded"></div>
              <div class="h-4 w-4/6 bg-slate-100 rounded"></div>
            </div>
            <div class="h-12 w-full bg-slate-200 rounded-xl mt-6"></div>
          </div>
        </div>
      } @else {
        @if (product(); as prod) {
          <!-- Product Detail Card -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg">
            <!-- Gallery Section -->
            <div class="space-y-4">
              <!-- Active Main Image -->
              <div class="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner">
                <img
                  [src]="selectedImage() || (prod.images | sanitizeImage)"
                  [alt]="prod.title"
                  appImageFallback
                  class="w-full h-full object-cover object-center transition-all duration-300"
                />
                <span class="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide bg-brand-primary/90 text-white backdrop-blur-md shadow">
                  {{ prod.category.name }}
                </span>
              </div>

              <!-- Thumbnail Selector -->
              @if (prod.images.length > 1) {
                <div class="flex items-center gap-3 overflow-x-auto pb-2">
                  @for (img of prod.images; track $index) {
                    <button
                      type="button"
                      (click)="selectImage(img)"
                      class="relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 focus:outline-none"
                      [ngClass]="{
                        'border-brand-accent ring-2 ring-brand-accent/30 scale-95': selectedImage() === img,
                        'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100': selectedImage() !== img
                      }"
                    >
                      <img
                        [src]="img | sanitizeImage"
                        [alt]="prod.title + ' ' + ($index + 1)"
                        appImageFallback
                        class="w-full h-full object-cover"
                      />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Product Info & Actions -->
            <div class="flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block">
                  En Stock • Entrega Inmediata
                </span>

                <h1 class="text-2xl sm:text-3xl font-black text-brand-primary leading-tight">
                  {{ prod.title }}
                </h1>

                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-black text-brand-accent">
                    {{ prod.price | priceFormat }}
                  </span>
                  <span class="text-xs text-slate-400 line-through">
                    {{ (prod.price * 1.25) | priceFormat }}
                  </span>
                  <span class="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    20% OFF
                  </span>
                </div>

                <div class="pt-4 border-t border-slate-100">
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Descripción del Producto</h3>
                  <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {{ prod.description }}
                  </p>
                </div>

                <!-- Product Details Specs -->
                <div class="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-slate-400 block font-medium">Categoría</span>
                    <span class="font-bold text-brand-primary">{{ prod.category.name }}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span class="text-slate-400 block font-medium">Código SKU</span>
                    <span class="font-bold text-brand-primary">PLZ-{{ prod.id }}-PRO</span>
                  </div>
                </div>
              </div>

              <!-- Actions Bar -->
              <div class="space-y-4 pt-6 border-t border-slate-100">
                <div class="flex items-center gap-4">
                  <!-- Quantity Selector -->
                  <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      type="button"
                      (click)="decrementQuantity()"
                      [disabled]="quantity() <= 1"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                    >
                      -
                    </button>
                    <span class="w-10 text-center font-bold text-sm text-brand-primary">{{ quantity() }}</span>
                    <button
                      type="button"
                      (click)="incrementQuantity()"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  <!-- Add to Cart CTA -->
                  <button
                    type="button"
                    (click)="addToCart(prod)"
                    class="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-md hover:bg-brand-secondary transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Añadir al Carrito ({{ (prod.price * quantity()) | priceFormat }})
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Product Not Found State -->
          <app-empty-state
            title="Producto no encontrado"
            message="El producto que buscas no existe o ha sido descontinuado de nuestro catálogo."
            actionText="Volver al catálogo"
            (actionClick)="goToCatalog()"
          />
        }
      }
    </main>
  `
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal<boolean>(true);
  readonly selectedImage = signal<string | null>(null);
  readonly quantity = signal<number>(1);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.loadProduct(id);
    }
  }

  loadProduct(id: number): void {
    this.loading.set(true);
    this.catalogService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        if (prod.images && prod.images.length > 0) {
          this.selectedImage.set(prod.images[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      }
    });
  }

  selectImage(img: string): void {
    this.selectedImage.set(img);
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, this.quantity());
    const total = product.price * this.quantity();
    this.notificationService.success(
      `¡Agregado! ${this.quantity()}x "${product.title}" por $${total.toFixed(2)} al carrito.`
    );
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
