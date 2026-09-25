import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 w-full bg-gradient-to-r from-brand-primary via-slate-900 to-brand-secondary border-b border-slate-800/80 shadow-md text-white">
      <!-- Global Loading Bar Indicator -->
      @if (loadingService.isLoading()) {
        <div class="h-1 w-full bg-slate-900/50 overflow-hidden relative">
          <div class="h-full bg-gradient-to-r from-brand-accent via-emerald-400 to-brand-accent animate-[shimmer_1s_infinite] w-full"></div>
        </div>
      }

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Brand Title -->
        <a routerLink="/" class="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-400/50 rounded-xl p-1">
          <div class="w-10 h-10 rounded-xl bg-white/10 text-white border border-white/15 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200 backdrop-blur-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <span class="text-lg font-extrabold tracking-tight text-white group-hover:text-brand-surface transition-colors">
              APEX STORE
            </span>
            <span class="block text-[10px] font-semibold tracking-wider uppercase text-slate-300 -mt-1">
              Platzi Catalog
            </span>
          </div>
        </a>

        <!-- Navigation Links, Badges & Shopping Cart -->
        <div class="flex items-center gap-2 sm:gap-4">
          <nav class="flex items-center gap-2" aria-label="Navegación principal">
            <a
              routerLink="/catalog"
              routerLinkActive="bg-white/15 text-white shadow-xs border-white/20"
              [routerLinkActiveOptions]="{ exact: false }"
              class="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-brand-surface hover:bg-white/10 border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            >
              Catálogo
            </a>

            <div class="hidden md:flex items-center pl-3 border-l border-slate-800/80">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/10 shadow-xs backdrop-blur-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Angular 19 Signals
              </span>
            </div>
          </nav>

          <!-- Cart Drawer Trigger Button -->
          <button
            type="button"
            (click)="cartService.openCart()"
            class="relative flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white hover:text-brand-surface shadow-xs transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
            aria-label="Abrir carrito de compras"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>

            <span class="hidden sm:inline font-bold text-xs tracking-wide text-white">Carrito</span>

            <!-- Badge -->
            @if (cartService.totalCount() > 0) {
              <span
                class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-emerald-500 text-white shadow-xs animate-bounce"
              >
                {{ cartService.totalCount() }}
              </span>
            } @else {
              <span
                class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full bg-white/10 text-slate-300 border border-white/10"
              >
                0
              </span>
            }
          </button>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly loadingService = inject(LoadingService);
  readonly cartService = inject(CartService);
}

