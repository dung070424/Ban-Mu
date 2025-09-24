import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss',
})
export class InvoicesComponent {
  protected readonly search = signal('');
  protected invoices!: ReturnType<DataService['getInvoices']>;
  protected readonly selectedInvoice: any = signal(null);

  // Stats
  protected readonly totalInvoices = computed(() => this.invoices().length);
  protected readonly totalRevenue = computed(() =>
    this.invoices().reduce((sum: number, inv: any) => sum + (inv.finalTotal || inv.total || 0), 0)
  );

  protected readonly filtered = computed(() => {
    const term = this.search().toLowerCase().trim();
    return this.invoices().filter((inv) => {
      const customer = inv.customerInfo?.name?.toLowerCase?.() || '';
      return !term || inv.id.toLowerCase().includes(term) || customer.includes(term);
    });
  });

  constructor(private dataService: DataService) {
    this.invoices = this.dataService.getInvoices();
  }

  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  protected openDetails(inv: any) {
    this.selectedInvoice.set(inv);
  }

  protected closeDetails() {
    this.selectedInvoice.set(null);
  }
}
