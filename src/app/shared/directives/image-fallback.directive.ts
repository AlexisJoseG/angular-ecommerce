import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {
  private readonly el = inject(ElementRef<HTMLImageElement>);

  @Input() appImageFallback = 'https://placehold.co/600x400/081c15/EBF2FA?text=No+Image';

  private hasFailed = false;

  @HostListener('error')
  onError(): void {
    if (!this.hasFailed) {
      this.hasFailed = true;
      this.el.nativeElement.src = this.appImageFallback;
      this.el.nativeElement.classList.add('opacity-90', 'grayscale-[30%]');
    }
  }
}
