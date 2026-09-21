export interface ProductFilterParams {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  offset?: number;
  limit?: number;
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
