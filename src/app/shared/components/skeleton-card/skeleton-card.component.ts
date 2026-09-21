import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm animate-pulse">
      <!-- Skeleton Image -->
      <div class="w-full aspect-[4/3] bg-slate-200 relative overflow-hidden">
        <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      
      <!-- Skeleton Content -->
      <div class="p-5 flex flex-col flex-1 justify-between gap-4">
        <div class="space-y-2.5">
          <!-- Category Badge Skeleton -->
          <div class="h-5 w-20 bg-slate-200 rounded-full"></div>
          <!-- Title Skeleton -->
          <div class="h-6 w-5/6 bg-slate-200 rounded-lg"></div>
          <!-- Description Skeleton -->
          <div class="space-y-1.5 pt-1">
            <div class="h-3.5 w-full bg-slate-100 rounded"></div>
            <div class="h-3.5 w-4/5 bg-slate-100 rounded"></div>
          </div>
        </div>

        <!-- Footer / Price Skeleton -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="h-7 w-24 bg-slate-200 rounded-lg"></div>
          <div class="h-9 w-24 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonCardComponent {}
