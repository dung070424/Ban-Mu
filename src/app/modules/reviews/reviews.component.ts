import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews">
      <div class="reviews-header">
        <h1>⭐ Quản Lý Đánh Giá</h1>
        <button class="btn btn-primary" (click)="showAddReviewModal = true">
          ➕ Thêm đánh giá
        </button>
      </div>

      <div class="reviews-filters">
        <div class="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Nội dung đánh giá, tên sản phẩm..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <label>Số sao:</label>
          <select [(ngModel)]="selectedRating" class="filter-select">
            <option value="">Tất cả</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Trạng thái:</label>
          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="inactive">Tạm dừng</option>
          </select>
        </div>
      </div>

      <div class="reviews-stats">
        <div class="stat-item">
          <span class="stat-label">Tổng đánh giá:</span>
          <span class="stat-value">{{ filteredReviews().length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Điểm trung bình:</span>
          <span class="stat-value success">{{ averageRating().toFixed(1) }}/5</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Chờ duyệt:</span>
          <span class="stat-value warning">{{ pendingReviews() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">5 sao:</span>
          <span class="stat-value success">{{ fiveStarReviews() }}</span>
        </div>
      </div>

      <div class="reviews-grid">
        @if (filteredReviews().length > 0) { @for (review of filteredReviews(); track review.id) {
        <div class="review-card" [class]="'status-' + review.trang_thai">
          <div class="review-header">
            <div class="review-rating">
              @for (star of getStars(review.so_sao); track $index) {
              <span class="star" [class]="star">
                {{ star === 'filled' ? '★' : '☆' }}
              </span>
              }
              <span class="rating-text">{{ review.so_sao }}/5</span>
            </div>
            <span class="review-status">{{ getStatusText(review.trang_thai) }}</span>
          </div>

          <div class="review-content">
            <p class="review-text">{{ review.noi_dung }}</p>
            <div class="review-meta">
              <div class="meta-item">
                <span class="label">Sản phẩm:</span>
                <span class="value">{{ getProductName(review.id_san_pham) }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Khách hàng:</span>
                <span class="value">{{ getCustomerName(review.id_khach_hang) }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Ngày tạo:</span>
                <span class="value">{{ formatDate(review.ngay_tao) }}</span>
              </div>
            </div>
          </div>

          <div class="review-actions">
            <button class="btn btn-sm btn-info" (click)="viewReview(review)">👁️ Xem</button>
            <button class="btn btn-sm btn-primary" (click)="editReview(review)">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" (click)="deleteReview(review.id)">🗑️ Xóa</button>
          </div>
        </div>
        } } @else {
        <div class="no-reviews">
          <div class="no-reviews-icon">⭐</div>
          <h3>Không tìm thấy đánh giá</h3>
          <p>Hãy thử thay đổi bộ lọc hoặc thêm đánh giá mới</p>
        </div>
        }
      </div>
    </div>

    <!-- Add Review Modal -->
    @if (showAddReviewModal) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Thêm đánh giá mới</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="addReview()" #reviewForm="ngForm">
            <div class="form-group">
              <label>Sản phẩm *</label>
              <select [(ngModel)]="newReview.id_san_pham" name="id_san_pham" required>
                <option value="">Chọn sản phẩm</option>
                @for (product of products; track product.id) {
                <option [value]="product.id">{{ product.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Khách hàng *</label>
              <select [(ngModel)]="newReview.id_khach_hang" name="id_khach_hang" required>
                <option value="">Chọn khách hàng</option>
                @for (customer of customers; track customer.id) {
                <option [value]="customer.id">{{ customer.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Số sao *</label>
              <select [(ngModel)]="newReview.so_sao" name="so_sao" required>
                <option value="5">5 sao - Tuyệt vời</option>
                <option value="4">4 sao - Tốt</option>
                <option value="3">3 sao - Trung bình</option>
                <option value="2">2 sao - Kém</option>
                <option value="1">1 sao - Rất kém</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nội dung đánh giá *</label>
              <textarea
                [(ngModel)]="newReview.noi_dung"
                name="noi_dung"
                rows="4"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select [(ngModel)]="newReview.trang_thai" name="trang_thai">
                <option value="active">Hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModals()">Hủy</button>
              <button type="submit" class="btn btn-primary" [disabled]="!reviewForm.valid">
                Thêm đánh giá
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }

    <!-- Review Detail Modal -->
    @if (showReviewDetailModal && selectedReview) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Chi tiết đánh giá</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <div class="review-details">
            <div class="detail-section">
              <h3>Thông tin đánh giá</h3>
              <div class="review-rating-detail">
                @for (star of getStars(selectedReview.so_sao); track $index) {
                <span class="star large" [class]="star">
                  {{ star === 'filled' ? '★' : '☆' }}
                </span>
                }
                <span class="rating-text large">{{ selectedReview.so_sao }}/5</span>
              </div>
              <div class="detail-item">
                <span class="label">Nội dung:</span>
                <span class="value">{{ selectedReview.noi_dung }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Trạng thái:</span>
                <span class="value">
                  <span class="status-badge" [class]="'status-' + selectedReview.trang_thai">
                    {{ getStatusText(selectedReview.trang_thai) }}
                  </span>
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h3>Thông tin liên quan</h3>
              <div class="detail-item">
                <span class="label">Sản phẩm:</span>
                <span class="value">{{ getProductName(selectedReview.id_san_pham) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Khách hàng:</span>
                <span class="value">{{ getCustomerName(selectedReview.id_khach_hang) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Ngày tạo:</span>
                <span class="value">{{ formatDate(selectedReview.ngay_tao) }}</span>
              </div>
              @if (selectedReview.ngay_cap_nhat) {
              <div class="detail-item">
                <span class="label">Ngày cập nhật:</span>
                <span class="value">{{ formatDate(selectedReview.ngay_cap_nhat) }}</span>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .reviews {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .reviews-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .reviews-header h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin: 0;
      }

      .reviews-filters {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 200px;
      }

      .filter-group label {
        font-weight: 600;
        color: #2c3e50;
      }

      .search-input,
      .filter-select {
        padding: 0.75rem;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        font-size: 1rem;
      }

      .search-input:focus,
      .filter-select:focus {
        outline: none;
        border-color: #3498db;
      }

      .reviews-stats {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .stat-item {
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .stat-label {
        font-size: 0.9rem;
        color: #7f8c8d;
      }

      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2c3e50;
      }

      .stat-value.warning {
        color: #f39c12;
      }

      .stat-value.success {
        color: #27ae60;
      }

      .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .review-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        border-left: 4px solid #ecf0f1;
      }

      .review-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      }

      .review-card.status-active {
        border-left-color: #27ae60;
      }

      .review-card.status-pending {
        border-left-color: #f39c12;
      }

      .review-card.status-inactive {
        border-left-color: #e74c3c;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .review-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .star {
        color: #f39c12;
        font-size: 1.2rem;
      }

      .star.empty {
        color: #ecf0f1;
      }

      .star.large {
        font-size: 1.8rem;
      }

      .rating-text {
        font-weight: 600;
        color: #2c3e50;
      }

      .rating-text.large {
        font-size: 1.2rem;
      }

      .review-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .review-text {
        color: #2c3e50;
        line-height: 1.6;
        margin: 0 0 1rem 0;
      }

      .review-meta {
        margin-bottom: 1rem;
      }

      .meta-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .meta-item .label {
        color: #7f8c8d;
        font-weight: 500;
      }

      .meta-item .value {
        color: #2c3e50;
        font-weight: 600;
      }

      .review-actions {
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

      .btn-info {
        background: #17a2b8;
        color: white;
      }

      .btn-info:hover {
        background: #138496;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }

      .no-reviews {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
        grid-column: 1 / -1;
      }

      .no-reviews-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .no-reviews h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
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

      .review-details {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .detail-section h3 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
        font-size: 1.2rem;
        border-bottom: 2px solid #ecf0f1;
        padding-bottom: 0.5rem;
      }

      .review-rating-detail {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0;
      }

      .detail-item .label {
        color: #7f8c8d;
        font-weight: 600;
        min-width: 120px;
      }

      .detail-item .value {
        color: #2c3e50;
        font-weight: 500;
        text-align: right;
        flex: 1;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .status-active {
        background: #d5f4e6;
        color: #27ae60;
      }

      .status-pending {
        background: #fef3c7;
        color: #92400e;
      }

      .status-inactive {
        background: #fee2e2;
        color: #991b1b;
      }

      @media (max-width: 768px) {
        .reviews-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .reviews-filters {
          flex-direction: column;
        }

        .reviews-grid {
          grid-template-columns: 1fr;
        }

        .review-header {
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .detail-item {
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-item .value {
          text-align: left;
        }
      }
    `,
  ],
})
export class ReviewsComponent {
  private dataService = inject(DataService);

  // Data
  reviews = this.dataService.danhGiaArray;
  products = this.dataService.productsArray;
  customers = this.dataService.customersArray;

  // Filters
  searchTerm = '';
  selectedRating = '';
  selectedStatus = '';

  // Modals
  showAddReviewModal = false;
  showReviewDetailModal = false;
  selectedReview: any = null;

  // New review form
  newReview = {
    so_sao: 5,
    noi_dung: '',
    trang_thai: 'active' as 'active' | 'inactive' | 'pending',
    id_khach_hang: '',
    id_san_pham: '',
  };

  filteredReviews = () => {
    let filtered = this.reviews;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r: any) =>
          r.noi_dung.toLowerCase().includes(term) ||
          this.getProductName(r.id_san_pham).toLowerCase().includes(term)
      );
    }

    if (this.selectedRating) {
      filtered = filtered.filter((r: any) => r.so_sao === parseInt(this.selectedRating));
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((r: any) => r.trang_thai === this.selectedStatus);
    }

    return filtered;
  };

  averageRating = () => {
    const reviews = this.reviews;
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum: number, r: any) => sum + r.so_sao, 0) / reviews.length;
  };

  pendingReviews = () => this.reviews.filter((r: any) => r.trang_thai === 'pending').length;
  fiveStarReviews = () => this.reviews.filter((r: any) => r.so_sao === 5).length;

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'filled' : 'empty');
    }
    return stars;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Hoạt động',
      inactive: 'Tạm dừng',
      pending: 'Chờ duyệt',
    };
    return statusMap[status] || status;
  }

  getProductName(productId: string): string {
    const product = this.products.find((p: any) => p.id === productId);
    return product ? product.name : 'Không xác định';
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers.find((c: any) => c.id === customerId);
    return customer ? customer.name : 'Không xác định';
  }

  viewReview(review: any) {
    this.selectedReview = review;
    this.showReviewDetailModal = true;
  }

  editReview(review: any) {
    // TODO: Implement edit functionality
    console.log('Edit review:', review);
  }

  deleteReview(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      // TODO: Implement delete functionality
      console.log('Delete review:', id);
    }
  }

  addReview() {
    this.dataService.addDanhGia(this.newReview);
    this.closeModals();
    this.resetNewReview();
  }

  closeModals() {
    this.showAddReviewModal = false;
    this.showReviewDetailModal = false;
    this.selectedReview = null;
  }

  resetNewReview() {
    this.newReview = {
      so_sao: 5,
      noi_dung: '',
      trang_thai: 'active',
      id_khach_hang: '',
      id_san_pham: '',
    };
  }

  formatDate = this.dataService.formatDate;
}
