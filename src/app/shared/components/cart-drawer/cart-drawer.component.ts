import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import { SanitizeImagePipe } from '../../pipes/sanitize-image.pipe';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PriceFormatPipe,
    SanitizeImagePipe,
    ImageFallbackDirective,
    TicketModalComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cartService.isOpen()) {
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        (click)="closeCart()"
        aria-hidden="true"
      ></div>

      <!-- Drawer Side Panel -->
      <aside
        class="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-200 animate-slideInRight"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-brand-primary via-slate-900 to-brand-secondary text-white flex items-center justify-between shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 id="cart-drawer-title" class="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                Tu Carrito
                @if (cartService.totalCount() > 0) {
                  <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {{ cartService.totalCount() }} {{ cartService.totalCount() === 1 ? 'ítem' : 'ítems' }}
                  </span>
                }
              </h2>
              <p class="text-xs text-slate-300 font-medium">Resumen de tu orden actual</p>
            </div>
          </div>

          <button
            type="button"
            (click)="closeCart()"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items Container / Scrollable Area -->
        <div class="flex-1 overflow-y-auto px-6 py-5 divide-y divide-slate-100 space-y-4">
          @for (item of cartService.items(); track item.product.id) {
            <article class="pt-4 first:pt-0 flex gap-4 items-start group">
              <!-- Product Image Thumbnail -->
              <a
                [routerLink]="['/products', item.product.id]"
                (click)="closeCart()"
                class="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80 shadow-sm block group-hover:ring-2 group-hover:ring-brand-accent/30 transition-all"
              >
                <img
                  [src]="item.product.images | sanitizeImage"
                  [alt]="item.product.title"
                  appImageFallback
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>

              <!-- Info & Controls -->
              <div class="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="text-sm font-bold text-brand-primary line-clamp-2 leading-snug">
                      <a
                        [routerLink]="['/products', item.product.id]"
                        (click)="closeCart()"
                        class="hover:text-brand-accent transition-colors"
                      >
                        {{ item.product.title }}
                      </a>
                    </h3>

                    <!-- Remove Item Button -->
                    <button
                      type="button"
                      (click)="removeItem(item.product.id, item.product.title)"
                      class="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0"
                      title="Eliminar producto"
                      aria-label="Eliminar producto del carrito"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>Precio unitario:</span>
                    <span class="font-semibold text-slate-700">{{ item.product.price | priceFormat }}</span>
                  </div>
                </div>

                <!-- Quantity controls & Row Subtotal -->
                <div class="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <div class="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5 shadow-sm">
                    <button
                      type="button"
                      (click)="decreaseQuantity(item.product.id)"
                      class="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand-primary hover:shadow-xs transition-all font-bold text-xs"
                      aria-label="Reducir cantidad"
                    >
                      -
                    </button>
                    <span class="w-8 text-center text-xs font-bold text-brand-primary">
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      (click)="increaseQuantity(item.product.id)"
                      class="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand-primary hover:shadow-xs transition-all font-bold text-xs"
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <div class="text-right">
                    <span class="text-[10px] text-slate-400 uppercase font-bold block">Subtotal</span>
                    <span class="text-sm font-extrabold text-brand-primary">
                      {{ (item.product.price * item.quantity) | priceFormat }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          } @empty {
            <div class="h-full min-h-[300px] flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
              <div class="w-20 h-20 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-accent shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="space-y-1">
                <h4 class="text-base font-bold text-brand-primary">Tu carrito está vacío</h4>
                <p class="text-xs text-slate-500 max-w-xs">
                  Explora nuestro catálogo con miles de productos y agrega tus artículos favoritos.
                </p>
              </div>
              <button
                type="button"
                (click)="exploreCatalog()"
                class="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs shadow-md hover:bg-brand-secondary transition-all"
              >
                Explorar catálogo
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          }
        </div>

        <!-- Footer / Checkout Section -->
        @if (!cartService.isEmpty()) {
          <div class="p-6 bg-slate-50 border-t border-slate-200/80 space-y-4 shadow-lg">
            <!-- Summary breakdown -->
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-slate-500">
                <span>Subtotal ({{ cartService.totalCount() }} artículos)</span>
                <span class="font-semibold text-slate-700">{{ cartService.subtotal() | priceFormat }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Envío estimado</span>
                <span class="font-semibold text-emerald-600">Gratis</span>
              </div>
              <div class="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span class="text-base font-extrabold text-brand-primary">Total general</span>
                <span class="text-2xl font-black text-brand-accent">{{ cartService.total() | priceFormat }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2 pt-2">
              <button
                type="button"
                (click)="onCheckout()"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0C63E7] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Proceder al Pago
              </button>

              <button
                type="button"
                (click)="clearCart()"
                class="w-full py-2.5 px-4 rounded-xl border border-slate-300/80 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-slate-600 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vaciar Carrito
              </button>
            </div>
          </div>
        }
      </aside>
    }

    <!-- Ticket Modal (80mm Thermal Receipt Preview & PDF Export) -->
    <app-ticket-modal
      [isOpen]="isTicketModalOpen()"
      [items]="cartService.items()"
      [subtotal]="cartService.subtotal()"
      [total]="cartService.total()"
      (closeModal)="closeTicketModal()"
      (purchaseCompleted)="onPurchaseCompleted()"
    />
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slideInRight {
      animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class CartDrawerComponent {
  readonly cartService = inject(CartService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly isTicketModalOpen = signal<boolean>(false);

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isTicketModalOpen()) {
      this.closeTicketModal();
      return;
    }
    if (this.cartService.isOpen()) {
      this.closeCart();
    }
  }

  closeCart(): void {
    this.cartService.closeCart();
  }

  increaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.updateQuantity(productId, -1);
  }

  removeItem(productId: number, title: string): void {
    this.cartService.removeItem(productId);
    this.notificationService.info(`Se eliminó "${title}" del carrito.`);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.notificationService.warning('El carrito ha sido vaciado.');
  }

  exploreCatalog(): void {
    this.closeCart();
    this.router.navigate(['/catalog']);
  }

  onCheckout(): void {
    if (this.cartService.items().length > 0) {
      this.isTicketModalOpen.set(true);
    } else {
      this.notificationService.warning('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
    }
  }

  proceedToCheckout(): void {
    this.onCheckout();
  }

  closeTicketModal(): void {
    this.isTicketModalOpen.set(false);
  }

  onPurchaseCompleted(): void {
    this.cartService.clearCart();
    this.isTicketModalOpen.set(false);
    this.closeCart();
  }
}

