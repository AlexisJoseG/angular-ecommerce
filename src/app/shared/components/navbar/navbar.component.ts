import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-40 w-full bg-[#0C63E7]/95 backdrop-blur-md border-b border-blue-600/70 text-white shadow-lg shadow-blue-900/15">
      <!-- Global Loading Bar Indicator -->
      @if (loadingService.isLoading()) {
        <div class="h-1 w-full bg-[#0C63E7] overflow-hidden relative">
          <div class="h-full bg-gradient-to-r from-sky-300 via-white to-sky-200 animate-[shimmer_1s_infinite] w-full"></div>
        </div>
      }

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Brand Title -->
        <a routerLink="/" class="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl p-1">
          <div class="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <span class="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-50 to-sky-100">
              APEX STORE
            </span>
            <span class="block text-[10px] font-semibold tracking-wider uppercase text-sky-200/90 -mt-1">
              Platzi Catalog
            </span>
          </div>
        </a>

        <!-- Navigation Links & Badges -->
        <nav class="flex items-center gap-2 sm:gap-4" aria-label="Navegación principal">
          <a
            routerLink="/catalog"
            routerLinkActive="bg-white/20 text-white shadow-sm border-white/30"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-4 py-2 rounded-xl text-sm font-medium text-blue-100 hover:text-white hover:bg-white/15 border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Catálogo
          </a>

          <div class="hidden sm:flex items-center pl-3 border-l border-white/20">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/25 shadow-inner">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse"></span>
              Angular 19 Signals
            </span>
          </div>
        </nav>
      </div>
    </header>
  `
})
export class NavbarComponent {
  readonly loadingService = inject(LoadingService);
}
