import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function' && component.hasUnsavedChanges()) {
    return window.confirm('Tienes cambios pendientes sin guardar. ¿Estás seguro de que deseas salir de esta página?');
  }
  return true;
};
