import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('./features/catalog/catalog.routes').then(m => m.CATALOG_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/product-detail/detail.routes').then(m => m.DETAIL_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'catalog'
  }
];
