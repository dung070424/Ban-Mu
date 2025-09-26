import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>📊 Bảng Điều Khiển</h1>
        <p class="subtitle">Tổng quan hệ thống quản lý bán mũ</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🛍️</div>
          <div class="stat-content">
            <h3>{{ dataService.productsArray.length }}</h3>
            <p>Sản phẩm</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>{{ dataService.customersArray.length }}</h3>
            <p>Khách hàng</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h3>{{ dataService.invoicesArray.length }}</h3>
            <p>Đơn hàng</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>{{ formatVnd(totalRevenue()) }}</h3>
            <p>Doanh thu</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🎫</div>
          <div class="stat-content">
            <h3>{{ dataService.couponsArray.length }}</h3>
            <p>Mã khuyến mãi</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👨‍💼</div>
          <div class="stat-content">
            <h3>{{ dataService.staffArray.length }}</h3>
            <p>Nhân viên</p>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-orders">
          <h2>📋 Đơn hàng gần đây</h2>
          <div class="orders-list">
            @if (dataService.invoicesArray.length > 0) { @for (invoice of
            dataService.invoicesArray.slice(0, 5); track invoice.id) {
            <div class="order-item">
              <div class="order-info">
                <span class="order-id">{{ invoice.id }}</span>
                <span class="order-date">{{ formatDate(invoice.date) }}</span>
              </div>
              <div class="order-total">{{ formatVnd(invoice.finalTotal) }}</div>
              <div class="order-status" [class]="'status-' + invoice.status">
                {{ getStatusText(invoice.status) }}
              </div>
            </div>
            } } @else {
            <p class="no-data">Chưa có đơn hàng nào</p>
            }
          </div>
        </div>

        <div class="low-stock">
          <h2>⚠️ Sản phẩm sắp hết hàng</h2>
          <div class="stock-list">
            @if (lowStockProducts().length > 0) { @for (product of lowStockProducts(); track
            product.id) {
            <div class="stock-item">
              <span class="product-name">{{ product.name }}</span>
              <span
                class="stock-count"
                [class]="product.stock <= product.minStock ? 'critical' : 'warning'"
              >
                {{ product.stock }} / {{ product.minStock }}
              </span>
            </div>
            } } @else {
            <p class="no-data">Tất cả sản phẩm đều đủ hàng</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .dashboard-header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: #2c3e50;
      }

      .subtitle {
        color: #7f8c8d;
        font-size: 1.1rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

      .dashboard-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .recent-orders,
      .low-stock {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .recent-orders h2,
      .low-stock h2 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #2c3e50;
      }

      .orders-list,
      .stock-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .order-item,
      .stock-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        border-bottom: 1px solid #ecf0f1;
      }

      .order-item:last-child,
      .stock-item:last-child {
        border-bottom: none;
      }

      .order-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .order-id {
        font-weight: 600;
        color: #2c3e50;
      }

      .order-date {
        font-size: 0.9rem;
        color: #7f8c8d;
      }

      .order-total {
        font-weight: 600;
        color: #27ae60;
      }

      .order-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-completed {
        background: #d5f4e6;
        color: #27ae60;
      }

      .status-pending {
        background: #fef9e7;
        color: #f39c12;
      }

      .status-cancelled {
        background: #fadbd8;
        color: #e74c3c;
      }

      .product-name {
        font-weight: 500;
        color: #2c3e50;
      }

      .stock-count {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .stock-count.critical {
        background: #fadbd8;
        color: #e74c3c;
      }

      .stock-count.warning {
        background: #fef9e7;
        color: #f39c12;
      }

      .no-data {
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        padding: 2rem;
      }

      @media (max-width: 768px) {
        .dashboard-content {
          grid-template-columns: 1fr;
        }

        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class DashboardComponent {
  dataService = inject(DataService);

  lowStockProducts = () => {
    return this.dataService.productsArray.filter((p: any) => p.stock <= p.minStock);
  };

  totalRevenue = () => {
    return this.dataService.invoicesArray.reduce(
      (sum: number, invoice: any) => sum + invoice.finalTotal,
      0
    );
  };

  formatVnd = this.dataService.formatVnd;
  formatDate = this.dataService.formatDate;

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      cancelled: 'Đã hủy',
    };
    return statusMap[status] || status;
  }
}
