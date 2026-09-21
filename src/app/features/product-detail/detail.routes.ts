import { Routes } from '@angular/router';
import { numericIdGuard } from '../../core/guards/numeric-id.guard';

export const DETAIL_ROUTES: Routes = [
  {
    path: ':id',
    canActivate: [numericIdGuard],
    loadComponent: () =>
      import('./pages/product-detail-page.component').then(m => m.ProductDetailPageComponent)
  }
];
