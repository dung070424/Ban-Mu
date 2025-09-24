import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  products: number;
}

interface ProductSales {
  productId: string;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

interface StaffPerformance {
  staffId: string;
  staffName: string;
  sales: number;
  orders: number;
  commission: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {
  // Dữ liệu báo cáo mẫu
  protected readonly salesData = signal<SalesData[]>([
    { date: '2024-01-01', revenue: 2500000, orders: 15, products: 25 },
    { date: '2024-01-02', revenue: 3200000, orders: 18, products: 32 },
    { date: '2024-01-03', revenue: 2800000, orders: 16, products: 28 },
    { date: '2024-01-04', revenue: 4100000, orders: 22, products: 35 },
    { date: '2024-01-05', revenue: 3600000, orders: 20, products: 30 },
    { date: '2024-01-06', revenue: 2900000, orders: 17, products: 26 },
    { date: '2024-01-07', revenue: 3300000, orders: 19, products: 31 },
    { date: '2024-01-08', revenue: 3800000, orders: 21, products: 33 },
    { date: '2024-01-09', revenue: 2700000, orders: 15, products: 24 },
    { date: '2024-01-10', revenue: 3500000, orders: 20, products: 29 },
    { date: '2024-01-11', revenue: 4200000, orders: 24, products: 38 },
    { date: '2024-01-12', revenue: 3100000, orders: 18, products: 27 },
    { date: '2024-01-13', revenue: 2900000, orders: 16, products: 25 },
    { date: '2024-01-14', revenue: 3700000, orders: 21, products: 32 },
    { date: '2024-01-15', revenue: 4000000, orders: 23, products: 36 },
  ]);

  protected readonly productSales = signal<ProductSales[]>([
    {
      productId: '1',
      productName: 'Mũ Lưỡi Trai Classic',
      category: 'Mũ lưỡi trai',
      quantitySold: 45,
      revenue: 11250000,
      profit: 4500000,
    },
    {
      productId: '2',
      productName: 'Mũ Len Mùa Đông',
      category: 'Mũ len',
      quantitySold: 38,
      revenue: 6840000,
      profit: 3040000,
    },
    {
      productId: '3',
      productName: 'Mũ Fedora Sang Trọng',
      category: 'Mũ fedora',
      quantitySold: 22,
      revenue: 9900000,
      profit: 3300000,
    },
    {
      productId: '4',
      productName: 'Mũ Bucket Unisex',
      category: 'Mũ bucket',
      quantitySold: 28,
      revenue: 5600000,
      profit: 2240000,
    },
    {
      productId: '5',
      productName: 'Mũ Bóng Chày Thể Thao',
      category: 'Mũ thể thao',
      quantitySold: 52,
      revenue: 11440000,
      profit: 5200000,
    },
    {
      productId: '6',
      productName: 'Mũ Len Cổ Điển',
      category: 'Mũ len',
      quantitySold: 35,
      revenue: 5250000,
      profit: 1750000,
    },
  ]);

  protected readonly staffPerformance = signal<StaffPerformance[]>([
    { staffId: '1', staffName: 'Nguyễn Văn An', sales: 8500000, orders: 45, commission: 425000 },
    { staffId: '2', staffName: 'Trần Thị Bình', sales: 12000000, orders: 62, commission: 600000 },
    { staffId: '3', staffName: 'Lê Văn Cường', sales: 6800000, orders: 38, commission: 340000 },
    { staffId: '4', staffName: 'Phạm Thị Dung', sales: 0, orders: 0, commission: 0 },
    { staffId: '5', staffName: 'Hoàng Văn Em', sales: 7200000, orders: 42, commission: 360000 },
  ]);

  // Trạng thái UI
  protected readonly selectedPeriod = signal('7days');
  protected readonly selectedReportType = signal('sales');

  // Computed values
  protected readonly filteredSalesData = computed(() => {
    const period = this.selectedPeriod();
    const data = this.salesData();

    switch (period) {
      case '7days':
        return data.slice(-7);
      case '30days':
        return data.slice(-30);
      case '90days':
        return data;
      default:
        return data.slice(-7);
    }
  });

  protected readonly totalRevenue = computed(() =>
    this.filteredSalesData().reduce((acc, day) => acc + day.revenue, 0)
  );

  protected readonly totalOrders = computed(() =>
    this.filteredSalesData().reduce((acc, day) => acc + day.orders, 0)
  );

  protected readonly totalProducts = computed(() =>
    this.filteredSalesData().reduce((acc, day) => acc + day.products, 0)
  );

  protected readonly averageOrderValue = computed(() => {
    const orders = this.totalOrders();
    return orders > 0 ? this.totalRevenue() / orders : 0;
  });

  protected readonly topSellingProducts = computed(() =>
    [...this.productSales()].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5)
  );

  protected readonly topRevenueProducts = computed(() =>
    [...this.productSales()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  );

  protected readonly topPerformingStaff = computed(() =>
    [...this.staffPerformance()].sort((a, b) => b.sales - a.sales).slice(0, 5)
  );

  protected readonly categorySales = computed(() => {
    const categories = new Map<string, { revenue: number; quantity: number }>();

    this.productSales().forEach((product) => {
      const existing = categories.get(product.category) || { revenue: 0, quantity: 0 };
      categories.set(product.category, {
        revenue: existing.revenue + product.revenue,
        quantity: existing.quantity + product.quantitySold,
      });
    });

    return Array.from(categories.entries())
      .map(([category, data]) => ({
        category,
        revenue: data.revenue,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  });

  protected readonly dailyGrowth = computed(() => {
    const data = this.filteredSalesData();
    if (data.length < 2) return 0;

    const latest = data[data.length - 1].revenue;
    const previous = data[data.length - 2].revenue;

    return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  });

  // Methods
  protected onPeriodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedPeriod.set(target.value);
  }

  protected onReportTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedReportType.set(target.value);
  }

  protected onReportTypeClick(type: string) {
    this.selectedReportType.set(type);
  }

  protected formatVnd(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  protected formatNumber(value: number): string {
    return value.toLocaleString('vi-VN');
  }

  protected formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  protected getGrowthColor(growth: number): string {
    if (growth > 0) return '#10b981';
    if (growth < 0) return '#ef4444';
    return '#6b7280';
  }

  protected getGrowthIcon(growth: number): string {
    if (growth > 0) return '📈';
    if (growth < 0) return '📉';
    return '➡️';
  }

  protected exportReport() {
    // Tạo dữ liệu CSV
    const data = this.getReportData();
    const csv = this.convertToCSV(data);
    this.downloadCSV(
      csv,
      `bao-cao-${this.selectedPeriod()}-${new Date().toISOString().split('T')[0]}.csv`
    );
  }

  protected getReportData(): any[] {
    const type = this.selectedReportType();

    switch (type) {
      case 'sales':
        return this.filteredSalesData();
      case 'products':
        return this.productSales();
      case 'staff':
        return this.staffPerformance();
      default:
        return this.filteredSalesData();
    }
  }

  protected convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => row[header]).join(',')),
    ].join('\n');

    return csvContent;
  }

  protected downloadCSV(csv: string, filename: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  protected getChartData() {
    const data = this.filteredSalesData();
    return {
      labels: data.map((d) => this.formatDate(d.date)),
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: data.map((d) => d.revenue),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }

  protected roundNumber(value: number): number {
    return Math.round(value);
  }

  protected getMaxRevenue(): number {
    const data = this.filteredSalesData();
    return data.length > 0 ? Math.max(...data.map((d) => d.revenue)) : 0;
  }

  protected getMaxCategoryRevenue(): number {
    const data = this.categorySales();
    return data.length > 0 ? Math.max(...data.map((c) => c.revenue)) : 0;
  }

  protected getRevenuePercentage(revenue: number): number {
    const max = this.getMaxRevenue();
    return max > 0 ? (revenue / max) * 100 : 0;
  }

  protected getCategoryRevenuePercentage(revenue: number): number {
    const max = this.getMaxCategoryRevenue();
    return max > 0 ? (revenue / max) * 100 : 0;
  }
}
