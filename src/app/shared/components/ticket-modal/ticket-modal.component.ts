import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CartItem } from '../../../core/models/cart.model';
import { NotificationService } from '../../../core/services/notification.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, PriceFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <!-- Modal Backdrop -->
      <div
        class="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
        (click)="onBackdropClick($event)"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-modal-title"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
          (click)="$event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-brand-primary via-slate-900 to-brand-secondary border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 id="ticket-modal-title" class="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  Comprobante de Compra
                 
                </h2>
                <p class="text-xs text-slate-400 font-medium">Revisa el desglose y descarga tu ticket en PDF</p>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Cerrar ventana de ticket"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Ticket Preview Area -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60 flex justify-center items-start">
            <!-- 80mm Thermal Receipt Paper Simulation -->
            <div
              #thermalTicket
              id="thermal-ticket-container"
              class="w-full max-w-[340px] bg-[#fefefe] text-slate-900 rounded-lg p-5 shadow-xl font-mono text-xs border border-slate-200 relative overflow-hidden select-text"
              style="font-family: 'Courier New', Courier, monospace;"
            >
              <!-- Paper Tear Top Effect (Visual) -->
              <div class="border-b-2 border-dashed border-slate-300 pb-3 mb-3 text-center space-y-1">
                <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white mb-1 font-bold text-sm">
                  ⚡
                </div>
                <h3 class="text-sm font-black tracking-widest text-slate-900 uppercase">
                  APEX STORE
                </h3>
                <p class="text-[10px] text-slate-600 uppercase font-semibold">
                  Catálogo Digital & E-Commerce
                </p>
                <p class="text-[9px] text-slate-500">
                  RIF: J-50183920-1 • TELF: +1 (800) 555-APEX
                </p>
                <p class="text-[9px] text-slate-500">
                  Av. Principal Tech Hub, Torre 4, Nivel 2
                </p>
              </div>

              <!-- Ticket Meta Details -->
              <div class="space-y-1 text-[10px] text-slate-700 border-b border-dashed border-slate-300 pb-2.5 mb-2.5">
                <div class="flex justify-between">
                  <span class="font-bold">ORDEN / TICKET:</span>
                  <span class="font-bold text-slate-900">#{{ ticketId() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>FECHA Y HORA:</span>
                  <span>{{ orderDate() | date:'dd/MM/yyyy, hh:mm a' }}</span>
                </div>
                <div class="flex justify-between">
                  <span>CAJA / TERMINAL:</span>
                  <span>POS-01 (WEB-ONLINE)</span>
                </div>
                <div class="flex justify-between">
                  <span>ESTADO:</span>
                  <span class="font-bold text-emerald-700 uppercase">PAGADO (APROBADO)</span>
                </div>
              </div>

              <!-- Items Table Header -->
              <div class="border-b border-slate-900 pb-1 mb-1.5 text-[9px] font-bold text-slate-900 flex justify-between uppercase">
                <span class="w-[50%] text-left">DESCRIPCIÓN</span>
                <span class="w-[18%] text-center">CANT</span>
                <span class="w-[32%] text-right">TOTAL</span>
              </div>

              <!-- Items List -->
              <div class="space-y-2 border-b border-dashed border-slate-300 pb-2.5 mb-2.5">
                @for (item of items(); track item.product.id) {
                  <div class="text-[10px] leading-tight">
                    <div class="font-bold text-slate-900 uppercase break-words">
                      {{ item.product.title }}
                    </div>
                    <div class="flex justify-between items-center text-[9px] text-slate-600 mt-0.5">
                      <span class="text-slate-500">
                        {{ item.quantity }} x {{ item.product.price | priceFormat }}
                      </span>
                      <span class="font-bold text-slate-900">
                        {{ (item.product.price * item.quantity) | priceFormat }}
                      </span>
                    </div>
                  </div>
                }
              </div>

              <!-- Financial Summary -->
              <div class="space-y-1 text-[10px] text-slate-700 border-b-2 border-dashed border-slate-400 pb-2.5 mb-3">
                <div class="flex justify-between">
                  <span>TOTAL ARTÍCULOS:</span>
                  <span class="font-bold text-slate-900">{{ totalItemsCount() }} unid.</span>
                </div>
                <div class="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span class="font-bold text-slate-900">{{ subtotal() | priceFormat }}</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>IMPUESTOS (IVA 0%):</span>
                  <span>$0.00</span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>ENVÍO ESTIMADO:</span>
                  <span class="font-semibold text-emerald-700">GRATIS</span>
                </div>
                <div class="pt-2 border-t border-slate-900 flex justify-between items-baseline text-xs font-black text-slate-900">
                  <span class="text-[11px] uppercase tracking-wider">TOTAL A PAGAR:</span>
                  <span class="text-sm font-black tracking-tight">{{ total() | priceFormat }}</span>
                </div>
              </div>

              <!-- Payment Method Info -->
              <div class="text-[9px] text-slate-600 space-y-0.5 border-b border-dashed border-slate-300 pb-2 mb-2">
                <div class="flex justify-between">
                  <span>MÉTODO DE PAGO:</span>
                  <span class="font-semibold text-slate-800">TARJETA DE DÉBITO/CRÉDITO</span>
                </div>
                <div class="flex justify-between">
                  <span>TRANSACCIÓN ID:</span>
                  <span class="font-mono text-slate-700">TXN-{{ ticketId() }}98</span>
                </div>
              </div>

              <!-- Barcode / QR Simulation -->
              <div class="pt-1 pb-2 flex flex-col items-center justify-center space-y-1.5">
                <!-- Barcode SVG Lines -->
                <div class="w-full flex justify-center py-1">
                  <div class="flex items-center gap-[2px] h-10 px-2 bg-white">
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[3px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[4px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[3px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[3px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[4px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[3px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[2px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[1px] h-9 bg-slate-900 inline-block"></span>
                    <span class="w-[3px] h-9 bg-slate-900 inline-block"></span>
                  </div>
                </div>
                <p class="text-[8px] font-mono tracking-widest text-slate-500 uppercase">
                  *{{ ticketId() }}-{{ totalItemsCount() }}*
                </p>
              </div>

              <!-- Thermal Footer Note -->
              <div class="text-center space-y-1 text-[9px] text-slate-500 pt-1 border-t border-dashed border-slate-300">
                <p class="font-bold text-slate-700">¡GRACIAS POR TU PREFERENCIA!</p>
                <p class="text-[8px] text-slate-500">
                  Conserva este ticket para cualquier reclamo o garantía dentro de los 30 días continuos.
                </p>
                <p class="text-[8px] text-slate-400 font-semibold tracking-wider">
                  WWW.APEXSTORE.IO
                </p>
              </div>
            </div>
          </div>

          <!-- Modal Action Buttons Footer -->
          <div class="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              (click)="close()"
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all order-2 sm:order-1"
            >
              Cerrar Vista
            </button>

            <button
              type="button"
              (click)="downloadPdf()"
              [disabled]="isGeneratingPdf()"
              class="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 hover:shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              @if (isGeneratingPdf()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generando PDF 80mm...</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Descargar Ticket (PDF 80mm)</span>
              }
            </button>

            <button
              type="button"
              (click)="finishAndClear()"
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-accent/20 hover:bg-brand-accent/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5 order-3"
              title="Finalizar compra y vaciar carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Completar Compra</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-scaleUp {
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class TicketModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly items = input<CartItem[]>([]);
  readonly subtotal = input<number>(0);
  readonly total = input<number>(0);

  readonly closeModal = output<void>();
  readonly purchaseCompleted = output<void>();

  @ViewChild('thermalTicket', { static: false })
  private thermalTicketRef?: ElementRef<HTMLDivElement>;

  private readonly notificationService = inject(NotificationService);

  readonly isGeneratingPdf = signal<boolean>(false);
  readonly ticketId = signal<string>('TK-84920');
  readonly orderDate = signal<Date>(new Date());

  readonly totalItemsCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        // Regenerate ticket ID and current date upon opening
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        this.ticketId.set(`TK-${randomNum}`);
        this.orderDate.set(new Date());
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  finishAndClear(): void {
    this.purchaseCompleted.emit();
    this.notificationService.success(
      `¡Compra completada con éxito! Ticket #${this.ticketId()} procesado.`
    );
    this.close();
  }

  async downloadPdf(): Promise<void> {
    if (!this.thermalTicketRef?.nativeElement) {
      this.notificationService.error('No se pudo encontrar el contenedor del ticket para generar el PDF.');
      return;
    }

    try {
      this.isGeneratingPdf.set(true);

      const ticketElement = this.thermalTicketRef.nativeElement;

      // Capture element to canvas with high resolution scale
      const canvas = await html2canvas(ticketElement, {
        scale: 3, // High resolution for crisp printing
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');

      // Thermal receipt width standard: 80 mm
      const pdfWidthMm = 80;
      // Calculate dynamic height in mm based on rendered aspect ratio
      const pdfHeightMm = (canvas.height * pdfWidthMm) / canvas.width;

      // Initialize jsPDF with custom 80mm continuous thermal format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidthMm, pdfHeightMm]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');

      const fileName = `ticket-compra-${this.ticketId()}.pdf`;
      pdf.save(fileName);

      this.notificationService.success(`Ticket descargado exitosamente: ${fileName}`);
    } catch (error) {
      console.error('Error generando ticket PDF:', error);
      this.notificationService.error('Ocurrió un error al exportar el ticket a PDF.');
    } finally {
      this.isGeneratingPdf.set(false);
    }
  }
}
