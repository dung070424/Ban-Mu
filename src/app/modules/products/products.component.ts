import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Product } from '../../services/data.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  // Dữ liệu sản phẩm từ data service
  protected readonly products = signal<Product[]>([]);

  constructor(private dataService: DataService) {
    // Khởi tạo dữ liệu sản phẩm từ service
    this.products.set(this.dataService.getProducts()());
  }

  // Trạng thái UI
  protected readonly showAddModal = signal(false);
  protected readonly showEditModal = signal(false);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly searchTerm = signal('');
  protected readonly selectedCategory = signal('all');
  protected readonly selectedStatus = signal('all');

  // Form data
  protected readonly newProduct = signal<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    imageUrl: '',
    category: '',
    sku: '',
    status: 'active',
  });

  // Computed properties
  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const status = this.selectedStatus();

    return this.products().filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory = category === 'all' || product.category === category;
      const matchesStatus = status === 'all' || product.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  protected readonly totalProducts = computed(() => this.products().length);
  protected readonly activeProducts = computed(
    () => this.products().filter((p) => p.status === 'active').length
  );
  protected readonly lowStockProducts = computed(() =>
    this.products().filter((p) => p.stock <= p.minStock)
  );
  protected readonly totalValue = computed(() =>
    this.products().reduce((acc, p) => acc + p.stock * p.cost, 0)
  );
  protected readonly categories = computed(() => {
    const cats = [...new Set(this.products().map((p) => p.category))];
    return [{ id: 'all', name: 'Tất cả' }, ...cats.map((cat) => ({ id: cat, name: cat }))];
  });

  // Event handlers
  protected onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  protected onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
  }

  protected onStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  protected onProductFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const product = this.selectedProduct();
    if (product) {
      (product as any)[field] = target.value;
      this.selectedProduct.set({ ...product });
    }
  }

  protected onProductNumberFieldChange(field: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const product = this.selectedProduct();
    if (product) {
      (product as any)[field] = +target.value;
      this.selectedProduct.set({ ...product });
    }
  }

  // Upload ảnh từ máy, đặt vào imageUrl (data URL)
  protected onLocalImageSelected(event: Event, mode: 'add' | 'edit') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      if (mode === 'add') {
        this.newProduct.update((p) => ({ ...p, imageUrl: url }));
      } else {
        const product = this.selectedProduct();
        if (product) {
          product.imageUrl = url;
          this.selectedProduct.set({ ...product });
        }
      }
    };
    reader.readAsDataURL(file);
    // reset để lần sau chọn cùng file vẫn trigger change
    input.value = '';
  }

  // Modal methods
  protected openAddModal() {
    this.newProduct.set({
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      maxStock: 0,
      imageUrl: '',
      category: '',
      sku: '',
      status: 'active',
    });
    this.showAddModal.set(true);
  }

  protected openEditModal(product: Product) {
    this.selectedProduct.set(product);
    this.showEditModal.set(true);
  }

  protected closeModals() {
    this.showAddModal.set(false);
    this.showEditModal.set(false);
    this.selectedProduct.set(null);
  }

  // CRUD operations
  protected addProduct() {
    const product = this.newProduct();
    const newProduct: Product = {
      id: this.dataService.generateId(),
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      cost: product.cost || 0,
      stock: product.stock || 0,
      minStock: product.minStock || 0,
      maxStock: product.maxStock || 0,
      imageUrl: product.imageUrl || '',
      category: product.category || '',
      sku: product.sku || '',
      status: product.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.update((products) => [...products, newProduct]);
    this.dataService.addProduct(newProduct);
    this.closeModals();
  }

  protected updateProduct() {
    const product = this.selectedProduct();
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      updatedAt: new Date(),
    };

    this.products.update((products) =>
      products.map((p) => (p.id === product.id ? updatedProduct : p))
    );
    this.dataService.updateProductObject(updatedProduct);
    this.closeModals();
  }

  protected deleteProduct(productId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.products.update((products) => products.filter((p) => p.id !== productId));
      this.dataService.deleteProduct(productId);
    }
  }

  protected toggleProductStatus(product: Product) {
    const updatedProduct: Product = {
      ...product,
      status: product.status === 'active' ? 'inactive' : 'active',
      updatedAt: new Date(),
    };

    this.products.update((products) =>
      products.map((p) => (p.id === product.id ? updatedProduct : p))
    );
    this.dataService.updateProductObject(updatedProduct);
  }

  protected updateStock(productId: string, newStock: number) {
    this.products.update((products) =>
      products.map((p) =>
        p.id === productId ? { ...p, stock: newStock, updatedAt: new Date() } : p
      )
    );
  }

  // Utility methods
  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN');
  }

  protected getStockStatus(product: Product): string {
    if (product.stock <= product.minStock) return 'low';
    if (product.stock >= product.maxStock) return 'high';
    return 'normal';
  }
}
