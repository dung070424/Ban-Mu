export interface KhachHang {
  ma_khach_hang: string;
  ten_khach_hang: string;
  sdt: string;
  email: string;
  mat_khau: string;
  ngay_sinh: Date;
  gioi_tinh: 'male' | 'female' | 'other';
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface DiaChiKhachHang {
  id: string;
  dia_chi_chi_tiet: string;
  tinh: string;
  quan: string;
  phuong: string;
  dia_chi_mac_dinh: boolean;
  ma_khach_hang: string;
}

// Legacy interface for backward compatibility
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
