export interface LoaiSanPham {
  ma_loai_san_pham: string;
  ten_loai_san_pham: string;
  mo_ta: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface NhaSanXuat {
  ma_nha_san_xuat: string;
  ten_nha_san_xuat: string;
  mo_ta: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface MauSac {
  id: string;
  ten_mau_sac: string;
  ma_mau_sac: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface KichThuoc {
  id: string;
  ten_kich_thuoc: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface TrongLuong {
  id: string;
  ma_trong_luong: string;
  ten_trong_luong: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface ChatLieu {
  id: string;
  ma_chat_lieu: string;
  ten_chat_lieu: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface CongNgheAnToan {
  id: string;
  ma_cong_nghe_an_toan: string;
  ten_cong_nghe_an_toan: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}

export interface SanPham {
  ma_san_pham: string;
  ten_san_pham: string;
  mo_ta: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  ma_loai_san_pham: string;
  ma_nha_san_xuat: string;
}

export interface ChiTietSanPham {
  id: string;
  gia_ban: number;
  gia_nhap: number;
  so_luong: number;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_san_pham: string;
  id_mau_sac: string;
  id_kich_thuoc: string;
  id_trong_luong: string;
  id_chat_lieu: string;
  id_cong_nghe_an_toan: string;
}

export interface ChiTietSanPhamChiTiet {
  id: string;
  ten_thuoc_tinh: string;
  gia_tri_thuoc_tinh: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_chi_tiet_san_pham: string;
}
