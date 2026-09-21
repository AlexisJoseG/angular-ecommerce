import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true,
  pure: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currencyCode = 'USD', locale = 'en-US'): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch {
      return `$${value.toFixed(2)}`;
    }
  }
}
