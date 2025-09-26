export interface KhuyenMai {
  ma_khuyen_mai: string;
  ten_khuyen_mai: string;
  mo_ta: string;
  ngay_bat_dau: Date;
  ngay_ket_thuc: Date;
  gia_tri_giam: number;
  loai_giam_gia: 'percentage' | 'fixed';
  dieu_kien_ap_dung: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive' | 'expired';
}

export interface ChiTietKhuyenMai {
  id: string;
  ten_chi_tiet_khuyen_mai: string;
  mo_ta: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khuyen_mai: string;
}

export interface ChiTietKhuyenMaiSanPham {
  id: string;
  gia_tri_giam: number;
  loai_giam_gia: 'percentage' | 'fixed';
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khuyen_mai: string;
  id_san_pham: string;
}

export interface ChiTietKhuyenMaiLoaiSanPham {
  id: string;
  gia_tri_giam: number;
  loai_giam_gia: 'percentage' | 'fixed';
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khuyen_mai: string;
  id_loai_san_pham: string;
}

export interface ChiTietKhuyenMaiNhaSanXuat {
  id: string;
  gia_tri_giam: number;
  loai_giam_gia: 'percentage' | 'fixed';
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khuyen_mai: string;
  id_nha_san_xuat: string;
}

export interface ChiTietKhuyenMaiKhachHang {
  id: string;
  gia_tri_giam: number;
  loai_giam_gia: 'percentage' | 'fixed';
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_khuyen_mai: string;
  id_khach_hang: string;
}
