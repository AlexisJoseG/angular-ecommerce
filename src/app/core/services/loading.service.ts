import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _activeRequests = signal<number>(0);

  readonly isLoading = computed(() => this._activeRequests() > 0);

  startLoading(): void {
    this._activeRequests.update(count => count + 1);
  }

  stopLoading(): void {
    this._activeRequests.update(count => Math.max(0, count - 1));
  }

  resetLoading(): void {
    this._activeRequests.set(0);
  }
}
