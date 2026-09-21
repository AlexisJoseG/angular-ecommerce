import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';
import { Category } from '../models/category.model';
import { ProductFilterParams } from '../models/filter-params.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.escuelajs.co/api/v1';

  /**
   * Obtiene la lista de productos con filtros y paginación opcionales
   */
  getProducts(filters: ProductFilterParams = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (filters.offset !== undefined) {
      params = params.set('offset', filters.offset.toString());
    }
    if (filters.limit !== undefined) {
      params = params.set('limit', filters.limit.toString());
    }
    if (filters.title) {
      params = params.set('title', filters.title);
    }
    if (filters.price_min !== undefined) {
      params = params.set('price_min', filters.price_min.toString());
    }
    if (filters.price_max !== undefined) {
      params = params.set('price_max', filters.price_max.toString());
    }
    if (filters.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId.toString());
    }

    return this.http.get<Product[]>(`${this.baseUrl}/products`, { params }).pipe(
      map(products => this.cleanProductsImages(products)),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Obtiene un producto por su ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      map(product => this.cleanProductImage(product)),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Búsqueda de productos por coincidencia de título
   */
  searchProducts(title: string): Observable<Product[]> {
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      return this.getProducts({ offset: 0, limit: 20 });
    }

    const params = new HttpParams().set('title', cleanTitle);
    return this.http.get<Product[]>(`${this.baseUrl}/products/`, { params }).pipe(
      map(products => this.cleanProductsImages(products)),
      catchError(err => {
        console.error('Error searching products:', err);
        return of([]);
      })
    );
  }

  /**
   * Obtiene la lista completa de categorías
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      map(categories =>
        categories.map(cat => ({
          ...cat,
          image: this.cleanImageUrl(cat.image)
        }))
      ),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Obtiene productos filtrados por el ID de categoría
   */
  getProductsByCategory(categoryId: number, offset = 0, limit = 20): Observable<Product[]> {
    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.http.get<Product[]>(`${this.baseUrl}/categories/${categoryId}/products`, { params }).pipe(
      map(products => this.cleanProductsImages(products)),
      catchError(err => throwError(() => err))
    );
  }

  /**
   * Limpia y normaliza URLs de imágenes defensivamente (corrige arrays serializados en JSON como strings)
   */
  private cleanImageUrl(url: string): string {
    if (!url) return 'https://placehold.co/600x400/081c15/EBF2FA?text=No+Image';

    // Maneja casos como '["https://..."]' o '["https://..."]'
    let cleaned = url.replace(/^[\["']+|[\]"']+$/g, '');
    cleaned = cleaned.replace(/\\"/g, '"');

    if (cleaned.startsWith('["') || cleaned.startsWith("['")) {
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cleaned = parsed[0];
        }
      } catch {
        cleaned = cleaned.replace(/[\[\]"]/g, '');
      }
    }

    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      return 'https://placehold.co/600x400/081c15/EBF2FA?text=Product+Image';
    }

    return cleaned;
  }

  private cleanProductImage(product: Product): Product {
    const cleanedImages = (product.images || [])
      .map(img => this.cleanImageUrl(img))
      .filter(img => img.length > 0);

    return {
      ...product,
      images: cleanedImages.length > 0 ? cleanedImages : ['https://placehold.co/600x400/081c15/EBF2FA?text=Product+Image']
    };
  }

  private cleanProductsImages(products: Product[]): Product[] {
    return products.map(p => this.cleanProductImage(p));
  }
}
