export interface DonHang {
  id: string;
  ten_nguoi_nhan: string;
  sdt_nguoi_nhan: string;
  dia_chi_nguoi_nhan: string;
  ghi_chu: string;
  ma_van_chuyen: string;
  ten_van_chuyen: string;
  phi_van_chuyen: number;
  ngay_dat_hang: Date;
  ngay_giao_hang_du_kien: Date;
  ngay_giao_hang_thuc_te?: Date;
  tong_tien: number;
  trang_thai: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  id_khach_hang: string;
  id_phuong_giao_gia: string;
  id_nhan_vien: string;
  ma_khuyen_mai?: string;
}

export interface ChiTietDonHang {
  id: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
  ghi_chu: string;
  id_don_hang: string;
  id_chi_tiet_san_pham: string;
}

export interface PhuongGiaoGiaChiNhanh {
  id: string;
  ten_phuong_giao_gia: string;
  gia_phuong_giao_gia: number;
  thoi_gian_giao_hang_toi_thieu: number;
  thoi_gian_giao_hang_toi_da: number;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khach_hang: string;
}

export interface PhuongGiaoGiaChiNhanhChiTiet {
  id: string;
  ten_phuong_giao_gia_chi_tiet: string;
  ngay_het_han: Date;
  trang_thai: 'active' | 'inactive';
  id_khach_hang: string;
  id_phuong_giao_gia: string;
}
