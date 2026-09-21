import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeImage',
  standalone: true,
  pure: true
})
export class SanitizeImagePipe implements PipeTransform {
  private readonly defaultFallback = 'https://placehold.co/600x400/081c15/EBF2FA?text=No+Image';

  transform(value: string | string[] | null | undefined, fallbackUrl = this.defaultFallback): string {
    if (!value) return fallbackUrl;

    let targetUrl = '';

    if (Array.isArray(value)) {
      targetUrl = value.length > 0 ? value[0] : '';
    } else if (typeof value === 'string') {
      targetUrl = value;
    }

    if (!targetUrl) return fallbackUrl;

    // Saneamiento de cadenas JSON escapadas como '["https://..."]'
    let cleaned = targetUrl.replace(/^[\["']+|[\]"']+$/g, '').trim();
    cleaned = cleaned.replace(/\\"/g, '"');

    if (cleaned.startsWith('["') || cleaned.startsWith("['")) {
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cleaned = parsed[0];
        }
      } catch {
        cleaned = cleaned.replace(/[\[\]"]/g, '').trim();
      }
    }

    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      return fallbackUrl;
    }

    return cleaned;
  }
}
