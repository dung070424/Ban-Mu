import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Product, Coupon } from '../../services/data.service';
import { Customer } from '../../shared/models/customer.model';

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss',
})
export class PosComponent {
  // Dữ liệu sản phẩm lấy từ DataService (dùng chung toàn hệ thống)
  protected products!: ReturnType<DataService['getProducts']>;

  // Tìm kiếm và lọc
  protected readonly searchTerm = signal<string>('');
  protected readonly selectedCategory = signal<string>('all');

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || product.category === category;

      return matchesSearch && matchesCategory;
    });
  });

  // Giỏ hàng
  protected readonly cartItems = signal<CartItem[]>([]);
  protected readonly cartTotalQuantity = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.qty, 0)
  );
  protected readonly cartTotalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Phiếu giảm giá
  protected coupons!: ReturnType<DataService['getCoupons']>;
  protected readonly couponCode = signal('');
  protected readonly appliedCoupon = signal<Coupon | null>(null);
  protected readonly eligibleAmountForCoupon = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    const items = this.cartItems();
    // Nếu không giới hạn sản phẩm/danh mục thì áp cho toàn bộ giỏ
    const limitProducts = coupon.applicableProducts?.length > 0;
    const limitCategories = coupon.applicableCategories?.length > 0;
    if (!limitProducts && !limitCategories) {
      return this.cartTotalPrice();
    }
    // Tính tổng của các món hợp lệ
    return items.reduce((sum, item) => {
      const product = this.products().find((p) => p.id === item.id);
      if (!product) return sum;
      const okProduct = limitProducts ? coupon.applicableProducts.includes(product.id) : false;
      const okCategory = limitCategories
        ? coupon.applicableCategories.includes(product.category)
        : false;
      return okProduct || okCategory ? sum + item.price * item.qty : sum;
    }, 0);
  });
  protected readonly discountAmount = computed(() => {
    const coupon = this.appliedCoupon();
    if (!coupon) return 0;
    // Kiểm tra điều kiện cơ bản (bỏ qua kiểm tra ngày để thuận tiện demo)
    if (coupon.status !== 'active') return 0;
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return 0;

    const base = this.eligibleAmountForCoupon();
    if (base <= 0 || base < coupon.minOrderAmount) return 0;

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.floor((base * coupon.value) / 100);
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.value;
    }
    discount = Math.min(discount, base);
    return discount;
  });
  protected readonly finalTotal = computed(() =>
    Math.max(0, this.cartTotalPrice() - this.discountAmount())
  );

  // Danh mục sản phẩm
  protected readonly categories = computed(() => {
    const cats = [...new Set(this.products().map((p) => p.category))];
    return [{ id: 'all', name: 'Tất cả' }, ...cats.map((cat) => ({ id: cat, name: cat }))];
  });

  // Khách hàng
  protected readonly customers = signal<Customer[]>([]);
  protected readonly selectedCustomer = signal<Customer | null>(null);
  protected readonly showCustomerModal = signal(false);
  protected readonly customerSearchTerm = signal('');
  protected readonly showAddCustomerModal = signal(false);
  protected readonly newCustomer = signal<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  constructor(private dataService: DataService) {
    // Lấy signal sản phẩm dùng chung từ DataService
    this.products = this.dataService.getProducts();
    this.coupons = this.dataService.getCoupons();

    // Khởi tạo dữ liệu khách hàng từ service
    this.customers.set(this.dataService.getCustomers());
  }

  // Computed properties cho khách hàng
  protected readonly filteredCustomers = computed(() => {
    const term = this.customerSearchTerm().toLowerCase();
    return this.customers().filter((customer) => {
      return (
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    });
  });

  // Phương thức tìm kiếm
  protected onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
  }

  // Phương thức giỏ hàng
  protected addToCart(productId: string) {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;

    // Kiểm tra số lượng tồn kho
    if (product.stock <= 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }

    const items = [...this.cartItems()];
    const existingItem = items.find((item) => item.id === productId);
    const currentQty = existingItem ? existingItem.qty : 0;

    // Kiểm tra số lượng trong giỏ hàng không vượt quá tồn kho
    if (currentQty >= product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      return;
    }

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
      });
    }

    this.cartItems.set(items);
  }

  protected increaseQty(productId: string) {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;

    const items = this.cartItems().map((item) => {
      if (item.id === productId) {
        // Kiểm tra số lượng tồn kho
        if (item.qty >= product.stock) {
          alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
    this.cartItems.set(items);
  }

  protected decreaseQty(productId: string) {
    const items = this.cartItems()
      .map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item))
      .filter((item) => item.qty > 0);
    this.cartItems.set(items);
  }

  protected removeFromCart(productId: string) {
    const items = this.cartItems().filter((item) => item.id !== productId);
    this.cartItems.set(items);
  }

  protected clearCart() {
    this.cartItems.set([]);
  }

  // Phương thức quản lý khách hàng
  protected onCustomerSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.customerSearchTerm.set(target.value);
  }

  protected openCustomerModal() {
    this.showCustomerModal.set(true);
    this.customerSearchTerm.set('');
  }

  protected closeCustomerModal() {
    this.showCustomerModal.set(false);
    this.customerSearchTerm.set('');
  }

  protected selectCustomer(customer: Customer) {
    this.selectedCustomer.set(customer);
    this.closeCustomerModal();
  }

  protected clearSelectedCustomer() {
    this.selectedCustomer.set(null);
  }

  // Phương thức quản lý form tạo khách hàng mới
  protected openAddCustomerModal() {
    this.newCustomer.set({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });
    this.showAddCustomerModal.set(true);
  }

  protected closeAddCustomerModal() {
    this.showAddCustomerModal.set(false);
    this.newCustomer.set({
      name: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });
  }

  protected onNewCustomerFieldChange(field: keyof Customer, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.newCustomer.update((customer) => ({
      ...customer,
      [field]: target.value,
    }));
  }

  protected addNewCustomer() {
    const customerData = this.newCustomer();

    // Kiểm tra thông tin bắt buộc
    if (!customerData.name || !customerData.phone) {
      alert('Vui lòng nhập tên và số điện thoại khách hàng');
      return;
    }

    // Tạo khách hàng mới
    const newCustomer: Customer = {
      id: this.dataService.generateId(),
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || '',
      address: customerData.address || '',
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date(),
      status: 'active',
      notes: customerData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Thêm vào local state
    this.customers.update((customers) => [...customers, newCustomer]);

    // Thêm vào data service
    this.dataService.addCustomer(newCustomer);

    // Chọn khách hàng mới tạo
    this.selectedCustomer.set(newCustomer);

    // Đóng modal
    this.closeAddCustomerModal();
  }

  // Thanh toán
  protected readonly showPaymentModal = signal(false);
  protected readonly selectedPaymentMethod = signal<'cash' | 'card' | 'transfer'>('cash');
  protected readonly customerAmount = signal(0);

  // Tính tiền thừa
  protected readonly changeAmount = computed(() => {
    const amount = this.customerAmount();
    const total = this.finalTotal();
    return amount > total ? amount - total : 0;
  });

  // Kiểm tra có thể thanh toán không
  protected readonly canProcessPayment = computed(() => {
    if (this.cartItems().length === 0) return false;

    if (this.selectedPaymentMethod() === 'cash') {
      return this.customerAmount() >= this.finalTotal();
    }

    return true; // Thẻ và chuyển khoản không cần kiểm tra số tiền
  });

  // Mở modal thanh toán
  protected processPayment() {
    this.showPaymentModal.set(true);
    this.customerAmount.set(0);
  }

  // Đóng modal thanh toán
  protected closePaymentModal() {
    this.showPaymentModal.set(false);
    this.customerAmount.set(0);
  }

  // Thay đổi phương thức thanh toán
  protected onPaymentMethodChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedPaymentMethod.set(target.value as 'cash' | 'card' | 'transfer');
    this.customerAmount.set(0);
  }

  // Thay đổi số tiền khách đưa
  protected onCustomerAmountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.customerAmount.set(Number(target.value) || 0);
  }

  // Đặt số tiền chính xác
  protected setExactAmount() {
    this.customerAmount.set(this.finalTotal());
  }

  // Áp mã giảm giá
  protected applyCoupon() {
    const code = this.couponCode().trim().toUpperCase();
    if (!code) {
      alert('Vui lòng nhập mã giảm giá');
      return;
    }
    const coupon = this.coupons().find((c) => c.code.toUpperCase() === code);
    if (!coupon) {
      alert('Mã giảm giá không hợp lệ');
      return;
    }
    this.appliedCoupon.set(coupon);
  }

  // Hủy mã giảm giá
  protected removeCoupon() {
    this.appliedCoupon.set(null);
    this.couponCode.set('');
  }

  // Xác nhận thanh toán
  protected confirmPayment() {
    if (!this.canProcessPayment()) return;

    // Tạo hóa đơn qua DataService (đã tự lưu và trừ kho)
    const invoice = this.dataService.createInvoice(
      this.cartItems(),
      this.discountAmount(),
      'current',
      this.selectedCustomer()
        ? { name: this.selectedCustomer()!.name, phone: this.selectedCustomer()!.phone }
        : undefined
    );

    // Cập nhật số lần sử dụng coupon
    const coupon = this.appliedCoupon();
    if (coupon && this.discountAmount() > 0) {
      this.dataService.updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
    }

    // Cập nhật thông tin khách hàng nếu có
    if (this.selectedCustomer()) {
      const customer = this.selectedCustomer()!;
      const paidTotal = invoice.finalTotal || this.finalTotal();
      const updatedCustomer: Customer = {
        ...customer,
        totalOrders: customer.totalOrders + 1,
        totalSpent: customer.totalSpent + paidTotal,
        lastOrderDate: new Date(),
        updatedAt: new Date(),
      };

      // Cập nhật trong local state
      this.customers.update((customers) =>
        customers.map((c) => (c.id === customer.id ? updatedCustomer : c))
      );

      // Cập nhật trong data service
      this.dataService.updateCustomer(updatedCustomer);
    }

    // Hiển thị thông báo thành công
    const customerInfo = this.selectedCustomer()
      ? `\nKhách hàng: ${this.selectedCustomer()!.name}`
      : '';

    alert(
      `Thanh toán thành công!\nTạm tính: ${this.formatVnd(invoice.total)}${
        this.discountAmount() > 0 ? `\nGiảm giá: -${this.formatVnd(this.discountAmount())}` : ''
      }\nThanh toán: ${this.formatVnd(
        invoice.finalTotal
      )}\nPhương thức: ${this.getPaymentMethodName(this.selectedPaymentMethod())}${
        this.changeAmount() > 0 ? `\nTiền thừa: ${this.formatVnd(this.changeAmount())}` : ''
      }${customerInfo}`
    );

    // Xóa giỏ hàng, khách hàng và đóng modal
    this.clearCart();
    this.clearSelectedCustomer();
    this.closePaymentModal();
    this.appliedCoupon.set(null);
    this.couponCode.set('');
  }

  // In hóa đơn
  protected printReceipt() {
    if (!this.canProcessPayment()) return;

    const receipt = {
      id: this.generateReceiptId(),
      date: new Date(),
      items: this.cartItems(),
      total: this.cartTotalPrice(),
      discount: this.discountAmount(),
      finalTotal: this.finalTotal(),
      paymentMethod: this.selectedPaymentMethod(),
      customerAmount: this.customerAmount(),
      change: this.changeAmount(),
    };

    // Tạo nội dung hóa đơn để in
    const receiptContent = this.generateReceiptContent(receipt);

    // Mở cửa sổ in
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Tạo ID hóa đơn
  private generateReceiptId(): string {
    const now = new Date();
    const timestamp = now.getTime();
    const random = Math.floor(Math.random() * 1000);
    return `HD${timestamp}${random}`;
  }

  // Lấy tên phương thức thanh toán
  private getPaymentMethodName(method: string): string {
    const methods = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      transfer: 'Chuyển khoản',
    };
    return methods[method as keyof typeof methods] || method;
  }

  // Tạo nội dung hóa đơn
  private generateReceiptContent(receipt: any): string {
    const customer = this.selectedCustomer();
    const discountInfo =
      receipt.discount && receipt.discount > 0
        ? `
        <div class="item">
          <span>Giảm giá:</span>
          <span>-${this.formatVnd(receipt.discount)}</span>
        </div>
        <div class="item">
          <span>Thanh toán:</span>
          <span>${this.formatVnd(receipt.finalTotal)}</span>
        </div>
      `
        : '';
    const customerInfo = customer
      ? `
      <div class="customer-info">
        <h3>Thông tin khách hàng:</h3>
        <p><strong>Tên:</strong> ${customer.name}</p>
        <p><strong>SĐT:</strong> ${customer.phone}</p>
        ${customer.email ? `<p><strong>Email:</strong> ${customer.email}</p>` : ''}
        ${customer.address ? `<p><strong>Địa chỉ:</strong> ${customer.address}</p>` : ''}
      </div>
    `
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hóa đơn ${receipt.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .receipt-info { margin-bottom: 20px; }
          .customer-info { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .items { margin-bottom: 20px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
          .payment-info { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎩 CỬA HÀNG MŨ</h1>
          <p>Hóa đơn: ${receipt.id}</p>
          <p>Ngày: ${receipt.date.toLocaleString('vi-VN')}</p>
        </div>

        ${customerInfo}

        <div class="items">
          <h3>Sản phẩm:</h3>
          ${receipt.items
            .map(
              (item: any) =>
                `<div class="item">
                  <span>${item.name} x${item.qty}</span>
                  <span>${this.formatVnd(item.price * item.qty)}</span>
                </div>`
            )
            .join('')}
        </div>

        <div class="total">
          <div class="item">
            <span>Tổng cộng:</span>
            <span>${this.formatVnd(receipt.total)}</span>
          </div>
          ${discountInfo}
        </div>

        <div class="payment-info">
          <p><strong>Phương thức thanh toán:</strong> ${this.getPaymentMethodName(
            receipt.paymentMethod
          )}</p>
          ${
            receipt.paymentMethod === 'cash'
              ? `
            <p><strong>Khách đưa:</strong> ${this.formatVnd(receipt.customerAmount)}</p>
            <p><strong>Tiền thừa:</strong> ${this.formatVnd(receipt.change)}</p>
          `
              : ''
          }
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p>Cảm ơn quý khách!</p>
        </div>
      </body>
      </html>
    `;
  }

  // Cập nhật số lượng sản phẩm trong kho
  private updateProductStock(cartItems: CartItem[]) {
    cartItems.forEach((cartItem) => {
      const product = this.products().find((p) => p.id === cartItem.id);
      if (!product) return;
      const updated = { ...product, stock: Math.max(0, product.stock - cartItem.qty) };
      this.dataService.updateProductObject(updated);
    });
  }

  // Phương thức tiện ích
  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected getProductStock(productId: string): number {
    const product = this.products().find((p) => p.id === productId);
    return product ? product.stock : 0;
  }
}
