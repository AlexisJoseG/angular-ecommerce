import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format.pipe';
import { SanitizeImagePipe } from '../../../../shared/pipes/sanitize-image.pipe';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    RouterLink,
    PriceFormatPipe,
    SanitizeImagePipe,
    TruncateTextPipe,
    ImageFallbackDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <!-- Image Container -->
      <a [routerLink]="['/products', product.id]" class="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 block">
        <img
          [src]="product.images | sanitizeImage"
          [alt]="product.title"
          loading="lazy"
          appImageFallback
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <!-- Category Badge -->
        <span
          class="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-brand-primary/90 text-white backdrop-blur-md shadow-sm border border-white/10"
        >
          {{ product.category.name }}
        </span>
      </a>

      <!-- Card Content -->
      <div class="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-brand-primary line-clamp-1 group-hover:text-brand-accent transition-colors">
            <a [routerLink]="['/products', product.id]" class="focus:outline-none">
              {{ product.title }}
            </a>
          </h3>

          <p class="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {{ product.description | truncateText:95 }}
          </p>
        </div>

        <!-- Footer / Price & Action -->
        <div class="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Precio</span>
            <span class="text-lg font-black text-brand-primary">
              {{ product.price | priceFormat }}
            </span>
          </div>

          <a
            [routerLink]="['/products', product.id]"
            class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-surface text-brand-accent font-semibold text-xs border border-brand-accent/20 hover:bg-brand-accent hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            aria-label="Ver detalles del producto"
          >
            Detalles
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
