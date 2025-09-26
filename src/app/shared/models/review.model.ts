export interface DanhGia {
  id: string;
  so_sao: number;
  noi_dung: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive' | 'pending';
  id_khach_hang: string;
  id_san_pham: string;
}

export interface ChiTietDanhGia {
  id: string;
  noi_dung_phan_hoi: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
  id_danh_gia: string;
}
