export interface HoaDon {
  ma_hoa_don: string;
  ngay_tao_hoa_don: Date;
  tong_tien: number;
  trang_thai: 'pending' | 'paid' | 'cancelled';
  ma_khach_hang: string;
  ma_nhan_vien: string;
  ma_phuong_thuc_thanh_toan: string;
}

export interface ChiTietHoaDon {
  id: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
  ghi_chu: string;
  id_hoa_don: string;
  id_chi_tiet_san_pham: string;
}

export interface PhuongThucThanhToan {
  id: string;
  ten_phuong_thuc_thanh_toan: string;
  mo_ta: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface ChiTietThanhToan {
  id: string;
  so_tien: number;
  ngay_thanh_toan: Date;
  trang_thai: 'pending' | 'completed' | 'failed';
  id_hoa_don: string;
  id_phuong_thuc_thanh_toan: string;
}
