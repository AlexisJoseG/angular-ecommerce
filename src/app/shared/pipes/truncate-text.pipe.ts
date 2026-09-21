import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true,
  pure: true
})
export class TruncateTextPipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 80, ellipsis = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit).trim() + ellipsis;
  }
}
