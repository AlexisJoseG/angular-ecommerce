import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY = 'catalogo_cart';

  readonly items = signal<CartItem[]>(this.loadFromStorage());
  readonly isOpen = signal<boolean>(false);

  readonly totalCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  readonly total = computed(() => this.subtotal());

  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    // Persistencia automática en localStorage cuando cambian los items
    effect(() => {
      const currentItems = this.items();
      this.saveToStorage(currentItems);
    });
  }

  addItem(product: Product, quantity = 1): void {
    if (quantity <= 0) return;

    this.items.update((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex > -1) {
        return currentItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { product, quantity }];
    });
  }

  updateQuantity(productId: number, delta: number): void {
    this.items.update((currentItems) => {
      return currentItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  }

  removeItem(productId: number): void {
    this.items.update((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  openCart(): void {
    this.isOpen.set(true);
  }

  closeCart(): void {
    this.isOpen.set(false);
  }

  toggleCart(): void {
    this.isOpen.update((open) => !open);
  }

  private loadFromStorage(): CartItem[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter(
              (item): item is CartItem =>
                item &&
                typeof item === 'object' &&
                item.product &&
                typeof item.product.id === 'number' &&
                typeof item.quantity === 'number' &&
                item.quantity > 0
            );
          }
        }
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    }
    return [];
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      }
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }
}
