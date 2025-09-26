export interface Admin {
  id: string;
  ten: string;
  email: string;
  mat_khau: string;
  sdt: string;
  dia_chi: string;
  ngay_tao: Date;
  ngay_cap_nhat: Date;
  trang_thai: 'active' | 'inactive';
}
