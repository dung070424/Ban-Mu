import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory">
      <div class="inventory-header">
        <h1>📦 Quản Lý Kho</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="showAddProductModal = true">
            ➕ Thêm sản phẩm
          </button>
          <button class="btn btn-secondary" (click)="showAddCategoryModal = true">
            🏷️ Thêm loại sản phẩm
          </button>
        </div>
      </div>

      <div class="inventory-filters">
        <div class="filter-group">
          <label>Tìm kiếm:</label>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Tên sản phẩm, SKU..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <label>Loại sản phẩm:</label>
          <select [(ngModel)]="selectedCategory" class="filter-select">
            <option value="">Tất cả</option>
            @for (category of dataService.loaiSanPhamArray; track category.ma_loai_san_pham) {
            <option [value]="category.ma_loai_san_pham">{{ category.ten_loai_san_pham }}</option>
            }
          </select>
        </div>
        <div class="filter-group">
          <label>Trạng thái:</label>
          <select [(ngModel)]="selectedStatus" class="filter-select">
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div class="inventory-stats">
        <div class="stat-item">
          <span class="stat-label">Tổng sản phẩm:</span>
          <span class="stat-value">{{ filteredProducts().length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Sắp hết hàng:</span>
          <span class="stat-value critical">{{ lowStockCount() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Hết hàng:</span>
          <span class="stat-value critical">{{ outOfStockCount() }}</span>
        </div>
      </div>

      <div class="products-grid">
        @for (product of filteredProducts(); track product.id) {
        <div class="product-card" [class.low-stock]="product.stock <= product.minStock">
          <div class="product-image">
            <img [src]="product.imageUrl" [alt]="product.name" loading="lazy" />
            <div class="product-status" [class]="'status-' + product.status">
              {{ product.status === 'active' ? 'Hoạt động' : 'Tạm dừng' }}
            </div>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-details">
              <div class="detail-item">
                <span class="label">SKU:</span>
                <span class="value">{{ product.sku }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Loại:</span>
                <span class="value">{{ product.category }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Giá bán:</span>
                <span class="value price">{{ formatVnd(product.price) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Giá nhập:</span>
                <span class="value">{{ formatVnd(product.cost) }}</span>
              </div>
            </div>
          </div>

          <div class="product-stock">
            <div class="stock-info">
              <div class="stock-current" [class]="getStockClass(product.stock, product.minStock)">
                {{ product.stock }} / {{ product.minStock }}
              </div>
              <div class="stock-label">Tồn kho / Tối thiểu</div>
            </div>
            <div class="stock-actions">
              <button class="btn btn-sm btn-outline" (click)="adjustStock(product, 'add')">
                ➕
              </button>
              <button class="btn btn-sm btn-outline" (click)="adjustStock(product, 'remove')">
                ➖
              </button>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-sm btn-primary" (click)="editProduct(product)">✏️ Sửa</button>
            <button class="btn btn-sm btn-danger" (click)="deleteProduct(product.id)">
              🗑️ Xóa
            </button>
          </div>
        </div>
        }
      </div>

      @if (filteredProducts().length === 0) {
      <div class="no-products">
        <div class="no-products-icon">📦</div>
        <h3>Không tìm thấy sản phẩm</h3>
        <p>Hãy thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
      </div>
      }
    </div>

    <!-- Add Product Modal -->
    @if (showAddProductModal) {
    <div class="modal-overlay" (click)="closeModals()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Thêm sản phẩm mới</h2>
          <button class="close-btn" (click)="closeModals()">×</button>
        </div>
        <div class="modal-body">
          <form (ngSubmit)="addProduct()" #productForm="ngForm">
            <div class="form-group">
              <label>Tên sản phẩm *</label>
              <input type="text" [(ngModel)]="newProduct.name" name="name" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea [(ngModel)]="newProduct.description" name="description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Giá bán *</label>
                <input type="number" [(ngModel)]="newProduct.price" name="price" required />
              </div>
              <div class="form-group">
                <label>Giá nhập *</label>
                <input type="number" [(ngModel)]="newProduct.cost" name="cost" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Số lượng *</label>
                <input type="number" [(ngModel)]="newProduct.stock" name="stock" required />
              </div>
              <div class="form-group">
                <label>Tồn tối thiểu *</label>
                <input type="number" [(ngModel)]="newProduct.minStock" name="minStock" required />
              </div>
            </div>
            <div class="form-group">
              <label>SKU *</label>
              <input type="text" [(ngModel)]="newProduct.sku" name="sku" required />
            </div>
            <div class="form-group">
              <label>Loại sản phẩm *</label>
              <select [(ngModel)]="newProduct.category" name="category" required>
                @for (category of dataService.loaiSanPhamArray; track category.ma_loai_san_pham) {
                <option [value]="category.ten_loai_san_pham">
                  {{ category.ten_loai_san_pham }}
                </option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Hình ảnh URL</label>
              <input type="url" [(ngModel)]="newProduct.imageUrl" name="imageUrl" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModals()">Hủy</button>
              <button type="submit" class="btn btn-primary" [disabled]="!productForm.valid">
                Thêm sản phẩm
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
      .inventory {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .inventory-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .inventory-header h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin: 0;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .inventory-filters {
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

      .inventory-stats {
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

      .stat-value.critical {
        color: #e74c3c;
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 1.5rem;
      }

      .product-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .product-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      }

      .product-card.low-stock {
        border-left: 4px solid #f39c12;
      }

      .product-image {
        position: relative;
        margin-bottom: 1rem;
      }

      .product-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
      }

      .product-status {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      .status-active {
        background: #d5f4e6;
        color: #27ae60;
      }

      .status-inactive {
        background: #fadbd8;
        color: #e74c3c;
      }

      .product-name {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 0.5rem 0;
      }

      .product-description {
        color: #7f8c8d;
        margin: 0 0 1rem 0;
        line-height: 1.4;
      }

      .product-details {
        margin-bottom: 1rem;
      }

      .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .detail-item .label {
        color: #7f8c8d;
        font-weight: 500;
      }

      .detail-item .value {
        color: #2c3e50;
        font-weight: 600;
      }

      .detail-item .value.price {
        color: #27ae60;
      }

      .product-stock {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .stock-info {
        text-align: center;
      }

      .stock-current {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
      }

      .stock-current.normal {
        color: #27ae60;
      }

      .stock-current.warning {
        color: #f39c12;
      }

      .stock-current.critical {
        color: #e74c3c;
      }

      .stock-label {
        font-size: 0.8rem;
        color: #7f8c8d;
      }

      .stock-actions {
        display: flex;
        gap: 0.5rem;
      }

      .product-actions {
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

      .btn-outline {
        background: transparent;
        border: 2px solid #3498db;
        color: #3498db;
      }

      .btn-outline:hover {
        background: #3498db;
        color: white;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }

      .no-products {
        text-align: center;
        padding: 4rem 2rem;
        color: #7f8c8d;
      }

      .no-products-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .no-products h3 {
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
        .inventory-header {
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
        }

        .inventory-filters {
          flex-direction: column;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .products-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class InventoryComponent {
  dataService = inject(DataService);

  // Filters
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  // Modals
  showAddProductModal = false;
  showAddCategoryModal = false;

  // New product form
  newProduct = {
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    maxStock: 100,
    imageUrl: '',
    category: '',
    sku: '',
    status: 'active' as 'active' | 'inactive',
  };

  filteredProducts = () => {
    let filtered = this.dataService.productsArray;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p: any) => p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter((p: any) => p.category === this.selectedCategory);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter((p: any) => p.status === this.selectedStatus);
    }

    return filtered;
  };

  lowStockCount = () => {
    return this.dataService.productsArray.filter((p: any) => p.stock <= p.minStock && p.stock > 0)
      .length;
  };

  outOfStockCount = () => {
    return this.dataService.productsArray.filter((p: any) => p.stock === 0).length;
  };

  getStockClass(stock: number, minStock: number): string {
    if (stock === 0) return 'critical';
    if (stock <= minStock) return 'warning';
    return 'normal';
  }

  adjustStock(product: any, action: 'add' | 'remove') {
    const change = action === 'add' ? 1 : -1;
    const newStock = Math.max(0, product.stock + change);

    this.dataService.updateProduct(product.id, { stock: newStock });
  }

  editProduct(product: any) {
    // TODO: Implement edit functionality
    console.log('Edit product:', product);
  }

  deleteProduct(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.dataService.deleteProduct(id);
    }
  }

  addProduct() {
    this.dataService.addProduct(this.newProduct);
    this.closeModals();
    this.resetNewProduct();
  }

  closeModals() {
    this.showAddProductModal = false;
    this.showAddCategoryModal = false;
  }

  resetNewProduct() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      maxStock: 100,
      imageUrl: '',
      category: '',
      sku: '',
      status: 'active',
    };
  }

  formatVnd = this.dataService.formatVnd;
}
