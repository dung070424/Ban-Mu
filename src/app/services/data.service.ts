import { Injectable, signal } from '@angular/core';
import { Customer, KhachHang, DiaChiKhachHang } from '../shared/models/customer.model';
import { Admin } from '../shared/models/admin.model';
import {
  SanPham,
  LoaiSanPham,
  NhaSanXuat,
  ChiTietSanPham,
  ChiTietSanPhamChiTiet,
  MauSac,
  KichThuoc,
  TrongLuong,
  ChatLieu,
  CongNgheAnToan,
} from '../shared/models/product.model';
import {
  DonHang,
  ChiTietDonHang,
  PhuongGiaoGiaChiNhanh,
  PhuongGiaoGiaChiNhanhChiTiet,
} from '../shared/models/order.model';
import {
  HoaDon,
  ChiTietHoaDon,
  PhuongThucThanhToan,
  ChiTietThanhToan,
} from '../shared/models/invoice.model';
import {
  KhuyenMai,
  ChiTietKhuyenMai,
  ChiTietKhuyenMaiSanPham,
  ChiTietKhuyenMaiLoaiSanPham,
  ChiTietKhuyenMaiNhaSanXuat,
  ChiTietKhuyenMaiKhachHang,
} from '../shared/models/promotion.model';
import { DanhGia, ChiTietDanhGia } from '../shared/models/review.model';
import { NhanVien } from '../shared/models/employee.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  maxStock: number;
  imageUrl: string;
  category: string;
  sku: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: Date;
  status: 'active' | 'inactive';
  avatar?: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Invoice {
  id: string;
  date: Date;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  status: 'completed' | 'pending' | 'cancelled';
  staffId: string;
  customerInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // Products
  private readonly products = signal<Product[]>([
    {
      id: '1',
      name: 'Mũ Lưỡi Trai Classic',
      description: 'Mũ lưỡi trai phong cách cổ điển, chất liệu cotton cao cấp',
      price: 250000,
      cost: 150000,
      stock: 24,
      minStock: 5,
      maxStock: 100,
      imageUrl:
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ lưỡi trai',
      sku: 'CAP-001',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'Mũ Len Mùa Đông',
      description: 'Mũ len ấm áp cho mùa đông, thiết kế trẻ trung',
      price: 180000,
      cost: 100000,
      stock: 29,
      minStock: 10,
      maxStock: 80,
      imageUrl:
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ len',
      sku: 'BEANIE-001',
      status: 'active',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: '3',
      name: 'Mũ Fedora Sang Trọng',
      description: 'Mũ fedora cao cấp, phù hợp cho các dịp trang trọng',
      price: 450000,
      cost: 300000,
      stock: 15,
      minStock: 3,
      maxStock: 50,
      imageUrl:
        'https://images.unsplash.com/photo-1542060748-10c28b62716a?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ fedora',
      sku: 'FEDORA-001',
      status: 'active',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '4',
      name: 'Mũ Bucket Unisex',
      description: 'Mũ bucket thời trang, phù hợp mọi lứa tuổi',
      price: 200000,
      cost: 120000,
      stock: 18,
      minStock: 5,
      maxStock: 60,
      imageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ bucket',
      sku: 'BUCKET-001',
      status: 'active',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-19'),
    },
    {
      id: '5',
      name: 'Mũ Bóng Chày Thể Thao',
      description: 'Mũ bóng chày chất liệu polyester, thấm hút mồ hôi tốt',
      price: 220000,
      cost: 130000,
      stock: 32,
      minStock: 8,
      maxStock: 120,
      imageUrl:
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ thể thao',
      sku: 'SPORT-001',
      status: 'active',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: '6',
      name: 'Mũ Len Cổ Điển',
      description: 'Mũ len ấm áp, thiết kế đơn giản và thanh lịch',
      price: 150000,
      cost: 80000,
      stock: 25,
      minStock: 5,
      maxStock: 70,
      imageUrl:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop',
      category: 'Mũ len',
      sku: 'BEANIE-002',
      status: 'inactive',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-17'),
    },
  ]);

  // Staff
  private readonly staff = signal<Staff[]>([
    {
      id: '1',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@banmu.com',
      phone: '0901234567',
      position: 'Nhân viên bán hàng',
      department: 'Bán hàng',
      salary: 8000000,
      hireDate: new Date('2023-01-15'),
      status: 'active',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      emergencyContact: 'Nguyễn Thị B',
      emergencyPhone: '0907654321',
      notes: 'Nhân viên có kinh nghiệm bán hàng tốt',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      email: 'binh.tran@banmu.com',
      phone: '0902345678',
      position: 'Quản lý cửa hàng',
      department: 'Quản lý',
      salary: 12000000,
      hireDate: new Date('2022-06-01'),
      status: 'active',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1200&auto=format&fit=crop',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      emergencyContact: 'Trần Văn C',
      emergencyPhone: '0908765432',
      notes: 'Quản lý có kinh nghiệm 5 năm',
      createdAt: new Date('2022-06-01'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      email: 'cuong.le@banmu.com',
      phone: '0903456789',
      position: 'Nhân viên kho',
      department: 'Kho vận',
      salary: 7000000,
      hireDate: new Date('2023-03-10'),
      status: 'active',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      emergencyContact: 'Lê Thị D',
      emergencyPhone: '0909876543',
      notes: 'Chăm chỉ, trách nhiệm cao',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      email: 'dung.pham@banmu.com',
      phone: '0904567890',
      position: 'Kế toán',
      department: 'Kế toán',
      salary: 9000000,
      hireDate: new Date('2022-09-15'),
      status: 'inactive',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      emergencyContact: 'Phạm Văn E',
      emergencyPhone: '0901987654',
      notes: 'Nghỉ thai sản',
      createdAt: new Date('2022-09-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      email: 'em.hoang@banmu.com',
      phone: '0905678901',
      position: 'Nhân viên bán hàng',
      department: 'Bán hàng',
      salary: 7500000,
      hireDate: new Date('2023-05-20'),
      status: 'active',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
      address: '654 Đường JKL, Quận 5, TP.HCM',
      emergencyContact: 'Hoàng Thị F',
      emergencyPhone: '0902098765',
      notes: 'Mới vào làm, đang học việc',
      createdAt: new Date('2023-05-20'),
      updatedAt: new Date('2024-01-20'),
    },
  ]);

  // Coupons
  private readonly coupons = signal<Coupon[]>([
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
      endDate: new Date('2024-12-31'),
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
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
  ]);

  // Invoices
  private readonly invoices = signal<Invoice[]>([]);

  // Cart
  private readonly cart = signal<CartItem[]>([]);

  // Getters
  getProducts() {
    return this.products.asReadonly();
  }

  getStaff() {
    return this.staff.asReadonly();
  }

  getCoupons() {
    return this.coupons.asReadonly();
  }

  getInvoices() {
    return this.invoices.asReadonly();
  }

  getCart() {
    return this.cart.asReadonly();
  }

  // Computed properties that return arrays directly
  get productsArray() {
    return this.products();
  }

  get staffArray() {
    return this.staff();
  }

  get couponsArray() {
    return this.coupons();
  }

  get invoicesArray() {
    return this.invoices();
  }

  get customersArray() {
    return this.customers();
  }

  get adminsArray() {
    return this.admins();
  }

  get khachHangArray() {
    return this.khachHang();
  }

  get diaChiKhachHangArray() {
    return this.diaChiKhachHang();
  }

  get loaiSanPhamArray() {
    return this.loaiSanPham();
  }

  get nhaSanXuatArray() {
    return this.nhaSanXuat();
  }

  get sanPhamArray() {
    return this.sanPham();
  }

  get donHangArray() {
    return this.donHang();
  }

  get danhGiaArray() {
    return this.danhGia();
  }

  get khuyenMaiArray() {
    return this.khuyenMai();
  }

  // Product methods
  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.update((products) => [...products, newProduct]);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    this.products.update((products) =>
      products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    );
  }

  updateProductObject(product: Product) {
    this.products.update((products) =>
      products.map((p) => (p.id === product.id ? { ...product, updatedAt: new Date() } : p))
    );
  }

  deleteProduct(id: string) {
    this.products.update((products) => products.filter((p) => p.id !== id));
  }

  // Staff methods
  addStaff(staff: Omit<Staff, 'id'>) {
    const newStaff: Staff = {
      ...staff,
      id: Date.now().toString(),
    };
    this.staff.update((staffList) => [...staffList, newStaff]);
    return newStaff;
  }

  updateStaff(updatedStaff: Staff) {
    this.staff.update((staffList) =>
      staffList.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
  }

  deleteStaff(id: string) {
    this.staff.update((staffList) => staffList.filter((s) => s.id !== id));
  }

  // Coupon methods
  addCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.coupons.update((coupons) => [...coupons, newCoupon]);
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>) {
    this.coupons.update((coupons) =>
      coupons.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c))
    );
  }

  deleteCoupon(id: string) {
    this.coupons.update((coupons) => coupons.filter((c) => c.id !== id));
  }

  // Cart methods
  addToCart(productId: string, quantity: number = 1) {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;

    this.cart.update((items) => {
      const existingItem = items.find((item) => item.id === productId);
      if (existingItem) {
        return items.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        return [
          ...items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            qty: quantity,
          },
        ];
      }
    });
  }

  updateCartItem(productId: string, quantity: number) {
    this.cart.update((items) => {
      if (quantity <= 0) {
        return items.filter((item) => item.id !== productId);
      }
      return items.map((item) => (item.id === productId ? { ...item, qty: quantity } : item));
    });
  }

  removeFromCart(productId: string) {
    this.cart.update((items) => items.filter((item) => item.id !== productId));
  }

  clearCart() {
    this.cart.set([]);
  }

  // Invoice methods
  createInvoice(items: CartItem[], discount: number = 0, staffId: string, customerInfo?: any) {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const finalTotal = total - discount;

    const invoice: Invoice = {
      id: 'INV-' + Date.now(),
      date: new Date(),
      items: [...items],
      total,
      discount,
      finalTotal,
      status: 'completed',
      staffId,
      customerInfo,
    };

    this.invoices.update((invoices) => [...invoices, invoice]);

    // Update product stock
    items.forEach((item) => {
      this.products.update((products) =>
        products.map((p) =>
          p.id === item.id ? { ...p, stock: p.stock - item.qty, updatedAt: new Date() } : p
        )
      );
    });

    return invoice;
  }

  // Utility methods
  formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  generateId(): string {
    return Date.now().toString();
  }

  // ===== ADMIN =====
  private readonly admins = signal<Admin[]>([]);

  // ===== CUSTOMERS (Legacy) =====
  private readonly customers = signal<Customer[]>([
    {
      id: '1',
      name: 'Nguyễn Văn An',
      phone: '0901234567',
      email: 'an.nguyen@email.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      totalOrders: 15,
      totalSpent: 2500000,
      lastOrderDate: new Date('2024-01-15'),
      status: 'active',
      notes: 'Khách hàng VIP, thường mua mũ cao cấp',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      phone: '0912345678',
      email: 'binh.tran@email.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      totalOrders: 8,
      totalSpent: 1200000,
      lastOrderDate: new Date('2024-01-10'),
      status: 'active',
      notes: 'Thích mũ len mùa đông',
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Lê Văn Cường',
      phone: '0923456789',
      email: 'cuong.le@email.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      totalOrders: 3,
      totalSpent: 450000,
      lastOrderDate: new Date('2023-12-20'),
      status: 'inactive',
      notes: 'Khách hàng mới, chưa quay lại',
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-12-20'),
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      phone: '0934567890',
      email: 'dung.pham@email.com',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      totalOrders: 22,
      totalSpent: 3800000,
      lastOrderDate: new Date('2024-01-20'),
      status: 'active',
      notes: 'Khách hàng thân thiết, mua nhiều mũ thể thao',
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      phone: '0945678901',
      email: 'em.hoang@email.com',
      address: '654 Đường JKL, Quận 5, TP.HCM',
      totalOrders: 1,
      totalSpent: 180000,
      lastOrderDate: new Date('2023-10-15'),
      status: 'inactive',
      notes: 'Chỉ mua 1 lần, không quay lại',
      createdAt: new Date('2023-10-15'),
      updatedAt: new Date('2023-10-15'),
    },
  ]);

  // ===== KHACH HANG (New ERD) =====
  private readonly khachHang = signal<KhachHang[]>([]);
  private readonly diaChiKhachHang = signal<DiaChiKhachHang[]>([]);

  // ===== PRODUCTS (New ERD) =====
  private readonly loaiSanPham = signal<LoaiSanPham[]>([]);
  private readonly nhaSanXuat = signal<NhaSanXuat[]>([]);
  private readonly sanPham = signal<SanPham[]>([]);
  private readonly chiTietSanPham = signal<ChiTietSanPham[]>([]);
  private readonly chiTietSanPhamChiTiet = signal<ChiTietSanPhamChiTiet[]>([]);
  private readonly mauSac = signal<MauSac[]>([]);
  private readonly kichThuoc = signal<KichThuoc[]>([]);
  private readonly trongLuong = signal<TrongLuong[]>([]);
  private readonly chatLieu = signal<ChatLieu[]>([]);
  private readonly congNgheAnToan = signal<CongNgheAnToan[]>([]);

  // ===== ORDERS (New ERD) =====
  private readonly donHang = signal<DonHang[]>([]);
  private readonly chiTietDonHang = signal<ChiTietDonHang[]>([]);
  private readonly phuongGiaoGiaChiNhanh = signal<PhuongGiaoGiaChiNhanh[]>([]);
  private readonly phuongGiaoGiaChiNhanhChiTiet = signal<PhuongGiaoGiaChiNhanhChiTiet[]>([]);

  // ===== INVOICES (New ERD) =====
  private readonly hoaDon = signal<HoaDon[]>([]);
  private readonly chiTietHoaDon = signal<ChiTietHoaDon[]>([]);
  private readonly phuongThucThanhToan = signal<PhuongThucThanhToan[]>([]);
  private readonly chiTietThanhToan = signal<ChiTietThanhToan[]>([]);

  // ===== PROMOTIONS (New ERD) =====
  private readonly khuyenMai = signal<KhuyenMai[]>([]);
  private readonly chiTietKhuyenMai = signal<ChiTietKhuyenMai[]>([]);
  private readonly chiTietKhuyenMaiSanPham = signal<ChiTietKhuyenMaiSanPham[]>([]);
  private readonly chiTietKhuyenMaiLoaiSanPham = signal<ChiTietKhuyenMaiLoaiSanPham[]>([]);
  private readonly chiTietKhuyenMaiNhaSanXuat = signal<ChiTietKhuyenMaiNhaSanXuat[]>([]);
  private readonly chiTietKhuyenMaiKhachHang = signal<ChiTietKhuyenMaiKhachHang[]>([]);

  // ===== REVIEWS (New ERD) =====
  private readonly danhGia = signal<DanhGia[]>([]);
  private readonly chiTietDanhGia = signal<ChiTietDanhGia[]>([]);

  // ===== EMPLOYEES (New ERD) =====
  private readonly nhanVien = signal<NhanVien[]>([]);

  // Customer methods (Legacy)
  getCustomers() {
    return this.customers();
  }
  addCustomer(customer: Customer) {
    this.customers.update((c) => [...c, customer]);
  }
  updateCustomer(updatedCustomer: Customer) {
    this.customers.update((c) =>
      c.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
    );
  }
  deleteCustomer(id: string) {
    this.customers.update((c) => c.filter((customer) => customer.id !== id));
  }

  // ===== NEW ERD METHODS =====

  // Admin methods
  getAdmins() {
    return this.admins.asReadonly();
  }
  addAdmin(admin: Omit<Admin, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newAdmin: Admin = {
      ...admin,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.admins.update((admins) => [...admins, newAdmin]);
    return newAdmin;
  }
  updateAdmin(id: string, updates: Partial<Admin>) {
    this.admins.update((admins) =>
      admins.map((a) => (a.id === id ? { ...a, ...updates, ngay_cap_nhat: new Date() } : a))
    );
  }
  deleteAdmin(id: string) {
    this.admins.update((admins) => admins.filter((a) => a.id !== id));
  }

  // KhachHang methods
  getKhachHang() {
    return this.khachHang.asReadonly();
  }
  addKhachHang(khachHang: Omit<KhachHang, 'ma_khach_hang' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newKhachHang: KhachHang = {
      ...khachHang,
      ma_khach_hang: 'KH-' + this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.khachHang.update((kh) => [...kh, newKhachHang]);
    return newKhachHang;
  }
  updateKhachHang(maKhachHang: string, updates: Partial<KhachHang>) {
    this.khachHang.update((kh) =>
      kh.map((k) =>
        k.ma_khach_hang === maKhachHang ? { ...k, ...updates, ngay_cap_nhat: new Date() } : k
      )
    );
  }
  deleteKhachHang(maKhachHang: string) {
    this.khachHang.update((kh) => kh.filter((k) => k.ma_khach_hang !== maKhachHang));
  }

  // DiaChiKhachHang methods
  getDiaChiKhachHang() {
    return this.diaChiKhachHang.asReadonly();
  }
  addDiaChiKhachHang(diaChi: Omit<DiaChiKhachHang, 'id'>) {
    const newDiaChi: DiaChiKhachHang = {
      ...diaChi,
      id: this.generateId(),
    };
    this.diaChiKhachHang.update((dc) => [...dc, newDiaChi]);
    return newDiaChi;
  }
  updateDiaChiKhachHang(id: string, updates: Partial<DiaChiKhachHang>) {
    this.diaChiKhachHang.update((dc) => dc.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  }
  deleteDiaChiKhachHang(id: string) {
    this.diaChiKhachHang.update((dc) => dc.filter((d) => d.id !== id));
  }

  // LoaiSanPham methods
  getLoaiSanPham() {
    return this.loaiSanPham.asReadonly();
  }
  addLoaiSanPham(loai: Omit<LoaiSanPham, 'ma_loai_san_pham' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newLoai: LoaiSanPham = {
      ...loai,
      ma_loai_san_pham: 'LSP-' + this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.loaiSanPham.update((lsp) => [...lsp, newLoai]);
    return newLoai;
  }

  // NhaSanXuat methods
  getNhaSanXuat() {
    return this.nhaSanXuat.asReadonly();
  }
  addNhaSanXuat(nhaSX: Omit<NhaSanXuat, 'ma_nha_san_xuat' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newNhaSX: NhaSanXuat = {
      ...nhaSX,
      ma_nha_san_xuat: 'NSX-' + this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.nhaSanXuat.update((nsx) => [...nsx, newNhaSX]);
    return newNhaSX;
  }

  // SanPham methods
  getSanPham() {
    return this.sanPham.asReadonly();
  }
  addSanPham(sanPham: Omit<SanPham, 'ma_san_pham' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newSanPham: SanPham = {
      ...sanPham,
      ma_san_pham: 'SP-' + this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.sanPham.update((sp) => [...sp, newSanPham]);
    return newSanPham;
  }

  // ChiTietSanPham methods
  getChiTietSanPham() {
    return this.chiTietSanPham.asReadonly();
  }
  addChiTietSanPham(chiTiet: Omit<ChiTietSanPham, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newChiTiet: ChiTietSanPham = {
      ...chiTiet,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.chiTietSanPham.update((ct) => [...ct, newChiTiet]);
    return newChiTiet;
  }

  // MauSac methods
  getMauSac() {
    return this.mauSac.asReadonly();
  }
  addMauSac(mau: Omit<MauSac, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newMau: MauSac = {
      ...mau,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.mauSac.update((ms) => [...ms, newMau]);
    return newMau;
  }

  // KichThuoc methods
  getKichThuoc() {
    return this.kichThuoc.asReadonly();
  }
  addKichThuoc(kichThuoc: Omit<KichThuoc, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newKichThuoc: KichThuoc = {
      ...kichThuoc,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.kichThuoc.update((kt) => [...kt, newKichThuoc]);
    return newKichThuoc;
  }

  // TrongLuong methods
  getTrongLuong() {
    return this.trongLuong.asReadonly();
  }
  addTrongLuong(trongLuong: Omit<TrongLuong, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newTrongLuong: TrongLuong = {
      ...trongLuong,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.trongLuong.update((tl) => [...tl, newTrongLuong]);
    return newTrongLuong;
  }

  // ChatLieu methods
  getChatLieu() {
    return this.chatLieu.asReadonly();
  }
  addChatLieu(chatLieu: Omit<ChatLieu, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newChatLieu: ChatLieu = {
      ...chatLieu,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.chatLieu.update((cl) => [...cl, newChatLieu]);
    return newChatLieu;
  }

  // CongNgheAnToan methods
  getCongNgheAnToan() {
    return this.congNgheAnToan.asReadonly();
  }
  addCongNgheAnToan(congNghe: Omit<CongNgheAnToan, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newCongNghe: CongNgheAnToan = {
      ...congNghe,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.congNgheAnToan.update((cnat) => [...cnat, newCongNghe]);
    return newCongNghe;
  }

  // DonHang methods
  getDonHang() {
    return this.donHang.asReadonly();
  }
  addDonHang(donHang: Omit<DonHang, 'id'>) {
    const newDonHang: DonHang = {
      ...donHang,
      id: this.generateId(),
    };
    this.donHang.update((dh) => [...dh, newDonHang]);
    return newDonHang;
  }

  // ChiTietDonHang methods
  getChiTietDonHang() {
    return this.chiTietDonHang.asReadonly();
  }
  addChiTietDonHang(chiTiet: Omit<ChiTietDonHang, 'id'>) {
    const newChiTiet: ChiTietDonHang = {
      ...chiTiet,
      id: this.generateId(),
    };
    this.chiTietDonHang.update((ct) => [...ct, newChiTiet]);
    return newChiTiet;
  }

  // HoaDon methods
  getHoaDon() {
    return this.hoaDon.asReadonly();
  }
  addHoaDon(hoaDon: Omit<HoaDon, 'ma_hoa_don'>) {
    const newHoaDon: HoaDon = {
      ...hoaDon,
      ma_hoa_don: 'HD-' + this.generateId(),
    };
    this.hoaDon.update((hd) => [...hd, newHoaDon]);
    return newHoaDon;
  }

  // ChiTietHoaDon methods
  getChiTietHoaDon() {
    return this.chiTietHoaDon.asReadonly();
  }
  addChiTietHoaDon(chiTiet: Omit<ChiTietHoaDon, 'id'>) {
    const newChiTiet: ChiTietHoaDon = {
      ...chiTiet,
      id: this.generateId(),
    };
    this.chiTietHoaDon.update((ct) => [...ct, newChiTiet]);
    return newChiTiet;
  }

  // PhuongThucThanhToan methods
  getPhuongThucThanhToan() {
    return this.phuongThucThanhToan.asReadonly();
  }
  addPhuongThucThanhToan(
    phuongThuc: Omit<PhuongThucThanhToan, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>
  ) {
    const newPhuongThuc: PhuongThucThanhToan = {
      ...phuongThuc,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.phuongThucThanhToan.update((pttt) => [...pttt, newPhuongThuc]);
    return newPhuongThuc;
  }

  // KhuyenMai methods
  getKhuyenMai() {
    return this.khuyenMai.asReadonly();
  }
  addKhuyenMai(khuyenMai: Omit<KhuyenMai, 'ma_khuyen_mai' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newKhuyenMai: KhuyenMai = {
      ...khuyenMai,
      ma_khuyen_mai: 'KM-' + this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.khuyenMai.update((km) => [...km, newKhuyenMai]);
    return newKhuyenMai;
  }

  // DanhGia methods
  getDanhGia() {
    return this.danhGia.asReadonly();
  }
  addDanhGia(danhGia: Omit<DanhGia, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newDanhGia: DanhGia = {
      ...danhGia,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.danhGia.update((dg) => [...dg, newDanhGia]);
    return newDanhGia;
  }

  // NhanVien methods
  getNhanVien() {
    return this.nhanVien.asReadonly();
  }
  addNhanVien(nhanVien: Omit<NhanVien, 'id' | 'ngay_tao' | 'ngay_cap_nhat'>) {
    const newNhanVien: NhanVien = {
      ...nhanVien,
      id: this.generateId(),
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    };
    this.nhanVien.update((nv) => [...nv, newNhanVien]);
    return newNhanVien;
  }
}
