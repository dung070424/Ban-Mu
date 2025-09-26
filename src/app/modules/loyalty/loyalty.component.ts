import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-loyalty',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="loyalty">
      <div class="loyalty-header">
        <h1>🎯 Chương Trình Khách Hàng Thân Thiết</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddCouponModal = true">
            ➕ Thêm mã giảm giá
          </button>
          <button class="btn btn-secondary" (click)="showAddPromotionModal = true">
            🎁 Thêm khuyến mãi
          </button>
        </div>
      </div>

      <div class="loyalty-stats">
        <div class="stat-card">
          <div class="stat-icon">🎫</div>
          <div class="stat-content">
            <h3>{{ totalCoupons() }}</h3>
            <p>Mã giảm giá</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎁</div>
          <div class="stat-content">
            <h3>{{ totalPromotions() }}</h3>
            <p>Chương trình khuyến mãi</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <h3>{{ vipCustomers() }}</h3>
            <p>Khách hàng VIP</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>{{ formatVnd(totalDiscountGiven()) }}</h3>
            <p>Tổng giảm giá</p>
          </div>
        </div>
      </div>

      <div class="loyalty-content">
        <!-- Coupons Section -->
        <div class="section">
          <div class="section-header">
            <h2>🎫 Mã Giảm Giá</h2>
            <div class="section-filter">
              <select [(ngModel)]="couponFilter" class="filter-select">
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
          </div>
          <div class="coupons-grid">
            @for (coupon of filteredCoupons(); track coupon.id) {
            <div class="coupon-card" [class]="'status-' + coupon.status">
              <div class="coupon-header">
                <h3>{{ coupon.code }}</h3>
                <span class="coupon-status">{{ getStatusText(coupon.status) }}</span>
              </div>
              <div class="coupon-info">
                <p class="coupon-name">{{ coupon.name }}</p>
                <p class="coupon-description">{{ coupon.description }}</p>
                <div class="coupon-details">
                  <div class="detail">
                    <span class="label">Giá trị:</span>
                    <span class="value">
                      {{
                        coupon.type === 'percentage' ? coupon.value + '%' : formatVnd(coupon.value)
                      }}
                    </span>
                  </div>
                  <div class="detail">
                    <span class="label">Đã sử dụng:</span>
                    <span class="value">{{ coupon.usedCount }}/{{ coupon.usageLimit }}</span>
                  </div>
                  <div class="detail">
                    <span class="label">Hết hạn:</span>
                    <span class="value">{{ formatDate(coupon.endDate) }}</span>
                  </div>
                </div>
              </div>
              <div class="coupon-actions">
                <button class="btn btn-sm btn-primary" (click)="editCoupon(coupon)">✏️ Sửa</button>
                <button class="btn btn-sm btn-danger" (click)="deleteCoupon(coupon.id)">
                  🗑️ Xóa
                </button>
              </div>
            </div>
            }
          </div>
        </div>

        <!-- Promotions Section -->
        <div class="section">
          <div class="section-header">
            <h2>🎁 Chương Trình Khuyến Mãi</h2>
            <div class="section-filter">
              <select [(ngModel)]="promotionFilter" class="filter-select">
                <option value="">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
          </div>
          <div class="promotions-grid">
            @for (promotion of filteredPromotions(); track promotion.ma_khuyen_mai) {
            <div class="promotion-card" [class]="'status-' + promotion.trang_thai">
              <div class="promotion-header">
                <h3>{{ promotion.ten_khuyen_mai }}</h3>
                <span class="promotion-status">{{ getStatusText(promotion.trang_thai) }}</span>
              </div>
              <div class="promotion-info">
                <p class="promotion-description">{{ promotion.mo_ta }}</p>
                <div class="promotion-details">
                  <div class="detail">
                    <span class="label">Giá trị:</span>
                    <span class="value">
                      {{
                        promotion.loai_giam_gia === 'percentage'
                          ? promotion.gia_tri_giam + '%'
                          : formatVnd(promotion.gia_tri_giam)
                      }}
                    </span>
                  </div>
                  <div class="detail">
                    <span class="label">Bắt đầu:</span>
                    <span class="value">{{ formatDate(promotion.ngay_bat_dau) }}</span>
                  </div>
                  <div class="detail">
                    <span class="label">Kết thúc:</span>
                    <span class="value">{{ formatDate(promotion.ngay_ket_thuc) }}</span>
                  </div>
                </div>
              </div>
              <div class="promotion-actions">
                <button class="btn btn-sm btn-primary" (click)="editPromotion(promotion)">
                  ✏️ Sửa
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  (click)="deletePromotion(promotion.ma_khuyen_mai)"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Add Coupon Modal -->
    @if (showAddCouponModal) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Thêm mã giảm giá mới</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="addCoupon()" #couponForm="ngForm">
            <div class="form-group">
              <label>Mã giảm giá *</label>
              <input type="text" [(ngModel)]="newCoupon.code" name="code" required />
            </div>
            <div class="form-group">
              <label>Tên *</label>
              <input type="text" [(ngModel)]="newCoupon.name" name="name" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea [(ngModel)]="newCoupon.description" name="description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Loại giảm giá *</label>
                <select [(ngModel)]="newCoupon.type" name="type" required>
                  <option value="percentage">Phần trăm</option>
                  <option value="fixed">Số tiền cố định</option>
                </select>
              </div>
              <div class="form-group">
                <label>Giá trị *</label>
                <input type="number" [(ngModel)]="newCoupon.value" name="value" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Đơn hàng tối thiểu</label>
                <input type="number" [(ngModel)]="newCoupon.minOrderAmount" name="minOrderAmount" />
              </div>
              <div class="form-group">
                <label>Giới hạn sử dụng</label>
                <input type="number" [(ngModel)]="newCoupon.usageLimit" name="usageLimit" />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModals()">Hủy</button>
              <button type="submit" class="btn btn-primary" [disabled]="!couponForm.valid">
                Thêm mã giảm giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }

    <!-- Add Promotion Modal -->
    @if (showAddPromotionModal) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Thêm chương trình khuyến mãi mới</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="addPromotion()" #promotionForm="ngForm">
            <div class="form-group">
              <label>Tên chương trình *</label>
              <input
                type="text"
                [(ngModel)]="newPromotion.ten_khuyen_mai"
                name="ten_khuyen_mai"
                required
              />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea [(ngModel)]="newPromotion.mo_ta" name="mo_ta"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Loại giảm giá *</label>
                <select [(ngModel)]="newPromotion.loai_giam_gia" name="loai_giam_gia" required>
                  <option value="percentage">Phần trăm</option>
                  <option value="fixed">Số tiền cố định</option>
                </select>
              </div>
              <div class="form-group">
                <label>Giá trị giảm *</label>
                <input
                  type="number"
                  [(ngModel)]="newPromotion.gia_tri_giam"
                  name="gia_tri_giam"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ngày bắt đầu *</label>
                <input
                  type="date"
                  [(ngModel)]="newPromotion.ngay_bat_dau"
                  name="ngay_bat_dau"
                  required
                />
              </div>
              <div class="form-group">
                <label>Ngày kết thúc *</label>
                <input
                  type="date"
                  [(ngModel)]="newPromotion.ngay_ket_thuc"
                  name="ngay_ket_thuc"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label>Điều kiện áp dụng</label>
              <textarea
                [(ngModel)]="newPromotion.dieu_kien_ap_dung"
                name="dieu_kien_ap_dung"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModals()">Hủy</button>
              <button type="submit" class="btn btn-primary" [disabled]="!promotionForm.valid">
                Thêm chương trình
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .loyalty {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .loyalty-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .loyalty-header h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .loyalty-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.2s;
      }

      .stat-card:hover {
        transform: translateY(-2px);
      }

      .stat-icon {
        font-size: 2.5rem;
      }

      .stat-content h3 {
        font-size: 2rem;
        margin: 0;
        color: #2c3e50;
      }

      .stat-content p {
        margin: 0;
        color: #7f8c8d;
        font-weight: 500;
      }

      .section {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .section-header h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
      }

      .filter-select {
        padding: 0.5rem;
        border: 2px solid #ecf0f1;
        border-radius: 6px;
        font-size: 0.9rem;
      }

      .coupons-grid,
      .promotions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .coupon-card,
      .promotion-card {
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        padding: 1.5rem;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .coupon-card:hover,
      .promotion-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .coupon-card.status-active,
      .promotion-card.status-active {
        border-color: #27ae60;
        background: #f8fff9;
      }

      .coupon-card.status-inactive,
      .promotion-card.status-inactive {
        border-color: #f39c12;
        background: #fffef8;
      }

      .coupon-card.status-expired,
      .promotion-card.status-expired {
        border-color: #e74c3c;
        background: #fff8f8;
      }

      .coupon-header,
      .promotion-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .coupon-header h3,
      .promotion-header h3 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.2rem;
      }

      .coupon-status,
      .promotion-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .coupon-name {
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      .coupon-description,
      .promotion-description {
        color: #7f8c8d;
        margin: 0 0 1rem 0;
        line-height: 1.4;
      }

      .coupon-details,
      .promotion-details {
        margin-bottom: 1rem;
      }

      .detail {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .detail .label {
        color: #7f8c8d;
        font-weight: 500;
      }

      .detail .value {
        color: #2c3e50;
        font-weight: 600;
      }

      .coupon-actions,
      .promotion-actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-primary:hover {
        background: #2980b9;
      }

      .btn-secondary {
        background: #95a5a6;
        color: white;
      }

      .btn-secondary:hover {
        background: #7f8c8d;
      }

      .btn-danger {
        background: #e74c3c;
        color: white;
      }

      .btn-danger:hover {
        background: #c0392b;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #ecf0f1;
      }

      .modal-header h2 {
        margin: 0;
        color: #2c3e50;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
      }

      .modal-body {
        padding: 1.5rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
      }

      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ecf0f1;
        border-radius: 6px;
        font-size: 1rem;
      }

      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        outline: none;
        border-color: #3498db;
      }

      .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }

      @media (max-width: 768px) {
        .loyalty-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .loyalty-stats {
          grid-template-columns: repeat(2, 1fr);
        }

        .section-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .coupons-grid,
        .promotions-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class LoyaltyComponent {
  private dataService = inject(DataService);

  // Data
  coupons = this.dataService.couponsArray;
  promotions = this.dataService.khuyenMaiArray;

  // Filters
  couponFilter = '';
  promotionFilter = '';

  // Modals
  showAddCouponModal = false;
  showAddPromotionModal = false;

  // New coupon form
  newCoupon = {
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(),
    status: 'active' as 'active' | 'inactive' | 'expired',
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
  };

  // New promotion form
  newPromotion = {
    ten_khuyen_mai: '',
    mo_ta: '',
    ngay_bat_dau: new Date(),
    ngay_ket_thuc: new Date(),
    gia_tri_giam: 0,
    loai_giam_gia: 'percentage' as 'percentage' | 'fixed',
    dieu_kien_ap_dung: '',
    trang_thai: 'active' as 'active' | 'inactive' | 'expired',
  };

  filteredCoupons = () => {
    let filtered = this.coupons;

    if (this.couponFilter) {
      filtered = filtered.filter((c: any) => c.status === this.couponFilter);
    }

    return filtered;
  };

  filteredPromotions = () => {
    let filtered = this.promotions;

    if (this.promotionFilter) {
      filtered = filtered.filter((p: any) => p.trang_thai === this.promotionFilter);
    }

    return filtered;
  };

  totalCoupons = () => this.coupons.length;
  totalPromotions = () => this.promotions.length;
  vipCustomers = () =>
    this.dataService.customersArray.filter((c: any) => c.totalSpent > 2000000).length;
  totalDiscountGiven = () => {
    return this.dataService.invoicesArray.reduce(
      (sum: number, invoice: any) => sum + invoice.discount,
      0
    );
  };

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Hoạt động',
      inactive: 'Tạm dừng',
      expired: 'Hết hạn',
    };
    return statusMap[status] || status;
  }

  editCoupon(coupon: any) {
    // TODO: Implement edit functionality
    console.log('Edit coupon:', coupon);
  }

  deleteCoupon(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      this.dataService.deleteCoupon(id);
    }
  }

  editPromotion(promotion: any) {
    // TODO: Implement edit functionality
    console.log('Edit promotion:', promotion);
  }

  deletePromotion(maKhuyenMai: string) {
    if (confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      // TODO: Implement delete promotion
      console.log('Delete promotion:', maKhuyenMai);
    }
  }

  addCoupon() {
    this.dataService.addCoupon(this.newCoupon);
    this.closeModals();
    this.resetNewCoupon();
  }

  addPromotion() {
    this.dataService.addKhuyenMai(this.newPromotion);
    this.closeModals();
    this.resetNewPromotion();
  }

  closeModals() {
    this.showAddCouponModal = false;
    this.showAddPromotionModal = false;
  }

  resetNewCoupon() {
    this.newCoupon = {
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(),
      status: 'active',
      applicableProducts: [],
      applicableCategories: [],
    };
  }

  resetNewPromotion() {
    this.newPromotion = {
      ten_khuyen_mai: '',
      mo_ta: '',
      ngay_bat_dau: new Date(),
      ngay_ket_thuc: new Date(),
      gia_tri_giam: 0,
      loai_giam_gia: 'percentage',
      dieu_kien_ap_dung: '',
      trang_thai: 'active',
    };
  }

  formatVnd = this.dataService.formatVnd;
  formatDate = this.dataService.formatDate;
}
