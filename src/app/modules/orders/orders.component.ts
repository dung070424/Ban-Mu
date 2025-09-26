import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="orders">
      <div class="orders-header">
        <h1>📦 Quản Lý Đơn Hàng</h1>
        <button class="btn btn-primary" (click)="showAddOrderModal = true">➕ Thêm đơn hàng</button>
      </div>

      <div class="orders-filters">
        <div class="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Mã đơn hàng, tên khách..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <label>Trạng thái:</label>
          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Từ ngày:</label>
          <input type="date" [(ngModel)]="fromDate" class="date-input" />
        </div>
        <div class="filter-group">
          <label>Đến ngày:</label>
          <input type="date" [(ngModel)]="toDate" class="date-input" />
        </div>
      </div>

      <div class="orders-stats">
        <div class="stat-item">
          <span class="stat-label">Tổng đơn hàng:</span>
          <span class="stat-value">{{ filteredOrders().length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Chờ xử lý:</span>
          <span class="stat-value warning">{{ pendingOrders() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Đang giao:</span>
          <span class="stat-value info">{{ shippingOrders() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Tổng giá trị:</span>
          <span class="stat-value success">{{ formatVnd(totalValue()) }}</span>
        </div>
      </div>

      <div class="orders-table">
        <div class="table-header">
          <div class="header-cell">Mã đơn hàng</div>
          <div class="header-cell">Khách hàng</div>
          <div class="header-cell">Ngày đặt</div>
          <div class="header-cell">Tổng tiền</div>
          <div class="header-cell">Trạng thái</div>
          <div class="header-cell">Thao tác</div>
        </div>
        <div class="table-body">
          @if (filteredOrders().length > 0) { @for (order of filteredOrders(); track order.id) {
          <div class="table-row">
            <div class="table-cell">{{ order.id }}</div>
            <div class="table-cell">{{ order.ten_nguoi_nhan }}</div>
            <div class="table-cell">{{ formatDate(order.ngay_dat_hang) }}</div>
            <div class="table-cell">{{ formatVnd(order.tong_tien) }}</div>
            <div class="table-cell">
              <span class="status-badge" [class]="'status-' + order.trang_thai">
                {{ getStatusText(order.trang_thai) }}
              </span>
            </div>
            <div class="table-cell">
              <div class="action-buttons">
                <button class="btn btn-sm btn-info" (click)="viewOrder(order)">👁️</button>
                <button class="btn btn-sm btn-primary" (click)="editOrder(order)">✏️</button>
                <button class="btn btn-sm btn-danger" (click)="deleteOrder(order.id)">🗑️</button>
              </div>
            </div>
          </div>
          } } @else {
          <div class="no-data">
            <div class="no-data-icon">📦</div>
            <h3>Không tìm thấy đơn hàng</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc thêm đơn hàng mới</p>
          </div>
          }
        </div>
      </div>
    </div>

    <!-- Add Order Modal -->
    @if (showAddOrderModal) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Thêm đơn hàng mới</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="addOrder()" #orderForm="ngForm">
            <div class="form-group">
              <label>Tên người nhận *</label>
              <input
                type="text"
                [(ngModel)]="newOrder.ten_nguoi_nhan"
                name="ten_nguoi_nhan"
                required
              />
            </div>
            <div class="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                [(ngModel)]="newOrder.sdt_nguoi_nhan"
                name="sdt_nguoi_nhan"
                required
              />
            </div>
            <div class="form-group">
              <label>Địa chỉ giao hàng *</label>
              <textarea
                [(ngModel)]="newOrder.dia_chi_nguoi_nhan"
                name="dia_chi_nguoi_nhan"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label>Ghi chú</label>
              <textarea [(ngModel)]="newOrder.ghi_chu" name="ghi_chu"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Phí vận chuyển</label>
                <input type="number" [(ngModel)]="newOrder.phi_van_chuyen" name="phi_van_chuyen" />
              </div>
              <div class="form-group">
                <label>Tổng tiền *</label>
                <input type="number" [(ngModel)]="newOrder.tong_tien" name="tong_tien" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ngày giao dự kiến</label>
                <input
                  type="date"
                  [(ngModel)]="newOrder.ngay_giao_hang_du_kien"
                  name="ngay_giao_hang_du_kien"
                />
              </div>
              <div class="form-group">
                <label>Trạng thái</label>
                <select [(ngModel)]="newOrder.trang_thai" name="trang_thai">
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModals()">Hủy</button>
              <button type="submit" class="btn btn-primary" [disabled]="!orderForm.valid">
                Thêm đơn hàng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    }

    <!-- Order Detail Modal -->
    @if (showOrderDetailModal && selectedOrder) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Chi tiết đơn hàng {{ selectedOrder.id }}</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <div class="order-details">
            <div class="detail-section">
              <h3>Thông tin khách hàng</h3>
              <div class="detail-item">
                <span class="label">Tên:</span>
                <span class="value">{{ selectedOrder.ten_nguoi_nhan }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Số điện thoại:</span>
                <span class="value">{{ selectedOrder.sdt_nguoi_nhan }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Địa chỉ:</span>
                <span class="value">{{ selectedOrder.dia_chi_nguoi_nhan }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h3>Thông tin đơn hàng</h3>
              <div class="detail-item">
                <span class="label">Ngày đặt:</span>
                <span class="value">{{ formatDate(selectedOrder.ngay_dat_hang) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Phí vận chuyển:</span>
                <span class="value">{{ formatVnd(selectedOrder.phi_van_chuyen) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Tổng tiền:</span>
                <span class="value">{{ formatVnd(selectedOrder.tong_tien) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Trạng thái:</span>
                <span class="value">
                  <span class="status-badge" [class]="'status-' + selectedOrder.trang_thai">
                    {{ getStatusText(selectedOrder.trang_thai) }}
                  </span>
                </span>
              </div>
              @if (selectedOrder.ghi_chu) {
              <div class="detail-item">
                <span class="label">Ghi chú:</span>
                <span class="value">{{ selectedOrder.ghi_chu }}</span>
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
      .orders {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .orders-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .orders-header h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin: 0;
      }

      .orders-filters {
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
      .filter-select,
      .date-input {
        padding: 0.75rem;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        font-size: 1rem;
      }

      .search-input:focus,
      .filter-select:focus,
      .date-input:focus {
        outline: none;
        border-color: #3498db;
      }

      .orders-stats {
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

      .stat-value.info {
        color: #3498db;
      }

      .stat-value.success {
        color: #27ae60;
      }

      .orders-table {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .table-header {
        display: grid;
        grid-template-columns: 150px 200px 150px 150px 150px 150px;
        background: #f8f9fa;
        border-bottom: 2px solid #ecf0f1;
      }

      .header-cell {
        padding: 1rem;
        font-weight: 600;
        color: #2c3e50;
        border-right: 1px solid #ecf0f1;
      }

      .table-body {
        max-height: 600px;
        overflow-y: auto;
      }

      .table-row {
        display: grid;
        grid-template-columns: 150px 200px 150px 150px 150px 150px;
        border-bottom: 1px solid #ecf0f1;
        transition: background-color 0.2s;
      }

      .table-row:hover {
        background: #f8f9fa;
      }

      .table-cell {
        padding: 1rem;
        color: #2c3e50;
        border-right: 1px solid #ecf0f1;
        display: flex;
        align-items: center;
      }

      .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .status-pending {
        background: #fef3c7;
        color: #92400e;
      }

      .status-confirmed {
        background: #dbeafe;
        color: #1e40af;
      }

      .status-shipping {
        background: #fde68a;
        color: #d97706;
      }

      .status-delivered {
        background: #d1fae5;
        color: #065f46;
      }

      .status-cancelled {
        background: #fee2e2;
        color: #991b1b;
      }

      .action-buttons {
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

      .no-data {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
        grid-column: 1 / -1;
      }

      .no-data-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .no-data h3 {
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
        max-width: 700px;
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

      .order-details {
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

      @media (max-width: 768px) {
        .orders-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .orders-filters {
          flex-direction: column;
        }

        .table-header,
        .table-row {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        .header-cell,
        .table-cell {
          border-right: none;
          border-bottom: 1px solid #ecf0f1;
        }

        .form-row {
          grid-template-columns: 1fr;
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
export class OrdersComponent {
  private dataService = inject(DataService);

  // Data
  orders = this.dataService.donHangArray;

  // Filters
  searchTerm = '';
  selectedStatus = '';
  fromDate = '';
  toDate = '';

  // Modals
  showAddOrderModal = false;
  showOrderDetailModal = false;
  selectedOrder: any = null;

  // New order form
  newOrder = {
    ten_nguoi_nhan: '',
    sdt_nguoi_nhan: '',
    dia_chi_nguoi_nhan: '',
    ghi_chu: '',
    ma_van_chuyen: '',
    ten_van_chuyen: '',
    phi_van_chuyen: 0,
    ngay_dat_hang: new Date(),
    ngay_giao_hang_du_kien: new Date(),
    ngay_giao_hang_thuc_te: undefined as Date | undefined,
    tong_tien: 0,
    trang_thai: 'pending' as 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled',
    id_khach_hang: '',
    id_phuong_giao_gia: '',
    id_nhan_vien: '',
    ma_khuyen_mai: '',
  };

  filteredOrders = () => {
    let filtered = this.orders;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o: any) =>
          o.id.toLowerCase().includes(term) || o.ten_nguoi_nhan.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((o: any) => o.trang_thai === this.selectedStatus);
    }

    if (this.fromDate) {
      filtered = filtered.filter((o: any) => o.ngay_dat_hang >= new Date(this.fromDate));
    }

    if (this.toDate) {
      filtered = filtered.filter((o: any) => o.ngay_dat_hang <= new Date(this.toDate));
    }

    return filtered;
  };

  pendingOrders = () => this.orders.filter((o: any) => o.trang_thai === 'pending').length;
  shippingOrders = () => this.orders.filter((o: any) => o.trang_thai === 'shipping').length;
  totalValue = () => this.orders.reduce((sum: number, o: any) => sum + o.tong_tien, 0);

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
    this.showOrderDetailModal = true;
  }

  editOrder(order: any) {
    // TODO: Implement edit functionality
    console.log('Edit order:', order);
  }

  deleteOrder(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      // TODO: Implement delete functionality
      console.log('Delete order:', id);
    }
  }

  addOrder() {
    this.dataService.addDonHang(this.newOrder);
    this.closeModals();
    this.resetNewOrder();
  }

  closeModals() {
    this.showAddOrderModal = false;
    this.showOrderDetailModal = false;
    this.selectedOrder = null;
  }

  resetNewOrder() {
    this.newOrder = {
      ten_nguoi_nhan: '',
      sdt_nguoi_nhan: '',
      dia_chi_nguoi_nhan: '',
      ghi_chu: '',
      ma_van_chuyen: '',
      ten_van_chuyen: '',
      phi_van_chuyen: 0,
      ngay_dat_hang: new Date(),
      ngay_giao_hang_du_kien: new Date(),
      ngay_giao_hang_thuc_te: undefined,
      tong_tien: 0,
      trang_thai: 'pending',
      id_khach_hang: '',
      id_phuong_giao_gia: '',
      id_nhan_vien: '',
      ma_khuyen_mai: '',
    };
  }

  formatVnd = this.dataService.formatVnd;
  formatDate = this.dataService.formatDate;
}
