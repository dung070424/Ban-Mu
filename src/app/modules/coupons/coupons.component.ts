import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'expired';
  applicableProducts: string[];
  applicableCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss',
})
export class CouponsComponent {
  // Dữ liệu phiếu giảm giá
  protected readonly coupons = signal<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME10',
      name: 'Chào mừng khách hàng mới',
      description: 'Giảm giá 10% cho đơn hàng đầu tiên',
      type: 'percentage',
      value: 10,
      minOrderAmount: 500000,
      maxDiscountAmount: 100000,
      usageLimit: 100,
      usedCount: 25,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-12-24'),
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2025-12-24'),
    },
    {
      id: '2',
      code: 'SUMMER50K',
      name: 'Khuyến mãi mùa hè',
      description: 'Giảm 50,000 VNĐ cho đơn hàng từ 300,000 VNĐ',
      type: 'fixed',
      value: 50000,
      minOrderAmount: 300000,
      usageLimit: 50,
      usedCount: 12,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      status: 'active',
      applicableProducts: [],
      applicableCategories: ['Mũ lưỡi trai', 'Mũ thể thao'],
      createdAt: new Date('2024-05-15'),
      updatedAt: new Date('2024-06-01'),
    },
    {
      id: '3',
      code: 'VIP20',
      name: 'Khách hàng VIP',
      description: 'Giảm giá 20% cho khách hàng VIP',
      type: 'percentage',
      value: 20,
      minOrderAmount: 1000000,
      maxDiscountAmount: 500000,
      usageLimit: 20,
      usedCount: 8,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '4',
      code: 'NEWYEAR30',
      name: 'Tết Nguyên Đán',
      description: 'Giảm giá 30% nhân dịp Tết',
      type: 'percentage',
      value: 30,
      minOrderAmount: 200000,
      maxDiscountAmount: 200000,
      usageLimit: 200,
      usedCount: 150,
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-02-20'),
      status: 'expired',
      applicableProducts: [],
      applicableCategories: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20'),
    },
    {
      id: '5',
      code: 'FLASH25K',
      name: 'Flash Sale',
      description: 'Giảm 25,000 VNĐ cho đơn hàng từ 150,000 VNĐ',
      type: 'fixed',
      value: 25000,
      minOrderAmount: 150000,
      usageLimit: 100,
      usedCount: 0,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-31'),
      status: 'inactive',
      applicableProducts: [],
      applicableCategories: ['Mũ len'],
      createdAt: new Date('2024-11-25'),
      updatedAt: new Date('2024-11-25'),
    },
  ]);

  // Trạng thái UI
  protected readonly showAddModal = signal(false);
  protected readonly showEditModal = signal(false);
  protected readonly showDetailModal = signal(false);
  protected readonly selectedCoupon = signal<Coupon | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly selectedStatus = signal('all');
  protected readonly selectedType = signal('all');

  // Form data
  protected readonly newCoupon = signal<Partial<Coupon>>({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active',
    applicableProducts: [],
    applicableCategories: [],
  });

  // Computed values
  protected readonly filteredCoupons = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();
    const type = this.selectedType();

    return this.coupons().filter((coupon) => {
      const matchesSearch =
        !term ||
        coupon.code.toLowerCase().includes(term) ||
        coupon.name.toLowerCase().includes(term) ||
        coupon.description.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || coupon.status === status;
      const matchesType = type === 'all' || coupon.type === type;

      return matchesSearch && matchesStatus && matchesType;
    });
  });

  protected readonly totalCoupons = computed(() => this.coupons().length);
  protected readonly activeCoupons = computed(
    () => this.coupons().filter((c) => c.status === 'active').length
  );
  protected readonly expiredCoupons = computed(
    () => this.coupons().filter((c) => c.status === 'expired').length
  );
  protected readonly totalUsage = computed(() =>
    this.coupons().reduce((acc, c) => acc + c.usedCount, 0)
  );

  // Methods
  protected onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  protected onTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedType.set(target.value);
  }

  protected openAddModal() {
    this.newCoupon.set({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
    });
    this.showAddModal.set(true);
  }

  protected openEditModal(coupon: Coupon) {
    this.selectedCoupon.set({ ...coupon });
    this.showEditModal.set(true);
  }

  protected openDetailModal(coupon: Coupon) {
    this.selectedCoupon.set(coupon);
    this.showDetailModal.set(true);
  }

  protected closeModals() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.showDetailModal.set(false);
    this.selectedCoupon.set(null);
  }

  protected addCoupon() {
    const coupon = this.newCoupon();
    if (!coupon.code || !coupon.name) return;

    const newCoupon: Coupon = {
      id: Date.now().toString(),
      code: coupon.code!,
      name: coupon.name!,
      description: coupon.description || '',
      type: coupon.type || 'percentage',
      value: coupon.value || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount,
      usageLimit: coupon.usageLimit || 1,
      usedCount: 0,
      startDate: coupon.startDate || new Date(),
      endDate: coupon.endDate || new Date(),
      status: (coupon.status || 'active') as 'active' | 'inactive' | 'expired',
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.coupons.update((coupons) => [...coupons, newCoupon]);
    this.closeModals();
  }

  protected updateCoupon() {
    const coupon = this.selectedCoupon();
    if (!coupon) return;

    const updatedCoupon: Coupon = {
      ...coupon,
      status: coupon.status as 'active' | 'inactive' | 'expired',
      updatedAt: new Date(),
    };
    this.coupons.update((coupons) => coupons.map((c) => (c.id === coupon.id ? updatedCoupon : c)));
    this.closeModals();
  }

  protected deleteCoupon(couponId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa phiếu giảm giá này?')) {
      this.coupons.update((coupons) => coupons.filter((c) => c.id !== couponId));
    }
  }

  protected toggleCouponStatus(coupon: Coupon) {
    const updatedCoupon: Coupon = {
      ...coupon,
      status: (coupon.status === 'active' ? 'inactive' : 'active') as
        | 'active'
        | 'inactive'
        | 'expired',
      updatedAt: new Date(),
    };
    this.coupons.update((coupons) => coupons.map((c) => (c.id === coupon.id ? updatedCoupon : c)));
  }

  protected generateCouponCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  protected getCouponStatus(coupon: Coupon): string {
    const now = new Date();
    if (coupon.status === 'inactive') return 'inactive';
    if (now > coupon.endDate) return 'expired';
    if (now < coupon.startDate) return 'upcoming';
    return 'active';
  }

  protected getUsagePercentage(coupon: Coupon): number {
    return coupon.usageLimit > 0 ? (coupon.usedCount / coupon.usageLimit) * 100 : 0;
  }

  protected isCouponExpired(coupon: Coupon): boolean {
    return new Date() > coupon.endDate;
  }

  protected getRemainingDays(coupon: Coupon): number {
    const now = new Date();
    const endDate = coupon.endDate;
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  protected getCurrentDate(): Date {
    return new Date();
  }

  protected formatDateOrCurrent(date?: Date): string {
    return this.formatDate(date || this.getCurrentDate());
  }

  protected onCouponFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const coupon = this.selectedCoupon();
    if (coupon) {
      (coupon as any)[field] = target.value;
    }
  }

  protected onCouponNumberFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const coupon = this.selectedCoupon();
    if (coupon) {
      (coupon as any)[field] = +target.value;
    }
  }

  protected onCouponTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const coupon = this.selectedCoupon();
    if (coupon) {
      coupon.type = target.value as 'percentage' | 'fixed';
    }
  }

  protected onCouponStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const coupon = this.selectedCoupon();
    if (coupon) {
      coupon.status = target.value as 'active' | 'inactive' | 'expired';
    }
  }

  protected onCouponDateChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const coupon = this.selectedCoupon();
    if (coupon) {
      (coupon as any)[field] = new Date(target.value);
    }
  }

  protected onNewCouponFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const coupon = this.newCoupon();
    (coupon as any)[field] = target.value;
  }

  protected onNewCouponNumberFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const coupon = this.newCoupon();
    (coupon as any)[field] = +target.value;
  }

  protected onNewCouponTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const coupon = this.newCoupon();
    coupon.type = target.value as 'percentage' | 'fixed';
  }

  protected onNewCouponDateChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const coupon = this.newCoupon();
    (coupon as any)[field] = new Date(target.value);
  }

  protected formatDateForInput(date?: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }
}
