export interface NhanVien {
  id: string;
  ten_nhan_vien: string;
  email: string;
  sdt: string;
  mat_khau: string;
  dia_chi: string;
  ngay_sinh: Date;
  gioi_tinh: 'male' | 'female' | 'other';
  ngay_vao_lam: Date;
  chuc_vu: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}
