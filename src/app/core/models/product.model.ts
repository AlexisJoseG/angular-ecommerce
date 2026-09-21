import { Category } from './category.model';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  creationAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
