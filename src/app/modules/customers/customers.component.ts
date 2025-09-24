import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Customer } from '../../shared/models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {
  // Dữ liệu khách hàng
  protected readonly customers = signal<Customer[]>([]);

  // Trạng thái UI
  protected readonly showAddModal = signal(false);
  protected readonly showEditModal = signal(false);
  protected readonly selectedCustomer = signal<Customer | null>(null);

  // Form data
  protected readonly newCustomer = signal<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'active',
  });

  // Filters
  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal('all');

  constructor(private dataService: DataService) {
    // Khởi tạo dữ liệu từ service
    this.customers.set(this.dataService.getCustomers());
  }

  // Computed properties
  protected readonly filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const status = this.statusFilter();

    return this.customers().filter((customer) => {
      const matchesSearch =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.address.toLowerCase().includes(term);

      const matchesStatus = status === 'all' || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  protected readonly totalCustomers = computed(() => this.customers().length);
  protected readonly activeCustomers = computed(
    () => this.customers().filter((c) => c.status === 'active').length
  );
  protected readonly totalRevenue = computed(() =>
    this.customers().reduce((sum, c) => sum + c.totalSpent, 0)
  );

  // Search and filter methods
  protected onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter.set(target.value);
  }

  // Customer field change methods
  protected onCustomerFieldChange(field: keyof Customer, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (this.selectedCustomer()) {
      this.selectedCustomer.update((customer) =>
        customer ? { ...customer, [field]: target.value } : null
      );
    }
  }

  protected onNewCustomerFieldChange(field: keyof Customer, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    this.newCustomer.update((customer) => ({ ...customer, [field]: target.value }));
  }

  protected onNewCustomerStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.newCustomer.update((customer) => ({
      ...customer,
      status: target.value as 'active' | 'inactive',
    }));
  }

  // Modal methods
  protected openAddModal() {
    this.newCustomer.set({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
      status: 'active',
    });
    this.showAddModal.set(true);
  }

  protected openEditModal(customer: Customer) {
    this.selectedCustomer.set({ ...customer });
    this.showEditModal.set(true);
  }

  protected closeModals() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.selectedCustomer.set(null);
  }

  // CRUD operations
  protected addCustomer() {
    const customer = this.newCustomer();
    if (!customer.name || !customer.phone) return;

    const newCustomer: Customer = {
      id: this.dataService.generateId(),
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || '',
      totalOrders: 0,
      totalSpent: 0,
      status: customer.status as 'active' | 'inactive',
      notes: customer.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.customers.update((customers) => [...customers, newCustomer]);
    this.closeModals();
  }

  protected updateCustomer() {
    const customer = this.selectedCustomer();
    if (!customer) return;

    const updatedCustomer: Customer = {
      ...customer,
      status: customer.status as 'active' | 'inactive',
      updatedAt: new Date(),
    };

    this.customers.update((customers) =>
      customers.map((c) => (c.id === customer.id ? updatedCustomer : c))
    );
    this.closeModals();
  }

  protected deleteCustomer(customerId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      this.customers.update((customers) => customers.filter((c) => c.id !== customerId));
    }
  }

  protected toggleCustomerStatus(customer: Customer) {
    const updatedCustomer: Customer = {
      ...customer,
      status: (customer.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive',
      updatedAt: new Date(),
    };

    this.customers.update((customers) =>
      customers.map((c) => (c.id === customer.id ? updatedCustomer : c))
    );
  }

  // Utility methods
  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  protected formatDateOrCurrent(date?: Date): string {
    return date ? this.formatDate(date) : 'Chưa có';
  }
}
