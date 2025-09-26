import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Hệ thống bán mũ POS');

  // Menu items
  protected readonly menuItems = signal([
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      icon: '📊',
      route: '/dashboard',
      permission: 'dashboard.view',
    },
    { id: 'pos', label: 'Bán hàng', icon: '🛒', route: '/pos', permission: 'pos.sell' },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: '📦',
      route: '/products',
      permission: 'products.view',
    },
    {
      id: 'inventory',
      label: 'Quản lý kho',
      icon: '📋',
      route: '/inventory',
      permission: 'inventory.view',
    },
    {
      id: 'orders',
      label: 'Quản lý đơn hàng',
      icon: '📦',
      route: '/orders',
      permission: 'orders.view',
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: '👤',
      route: '/customers',
      permission: 'customers.view',
    },
    {
      id: 'staff',
      label: 'Quản lý nhân viên',
      icon: '👥',
      route: '/staff',
      permission: 'staff.view',
    },
    {
      id: 'coupons',
      label: 'Phiếu giảm giá',
      icon: '🎫',
      route: '/coupons',
      permission: 'coupons.view',
    },
    {
      id: 'loyalty',
      label: 'Chương trình khách hàng thân thiết',
      icon: '🎯',
      route: '/loyalty',
      permission: 'loyalty.view',
    },
    {
      id: 'reviews',
      label: 'Quản lý đánh giá',
      icon: '⭐',
      route: '/reviews',
      permission: 'reviews.view',
    },
    {
      id: 'invoices',
      label: 'Quản lý hóa đơn',
      icon: '🧾',
      route: '/invoices',
      permission: 'invoices.view',
    },
    { id: 'reports', label: 'Báo cáo', icon: '📈', route: '/reports', permission: 'reports.view' },
  ]);

  protected readonly currentRoute = signal('');
  protected readonly sidebarOpen = signal(false);
  protected readonly groupOpenState = signal<Record<string, boolean>>({
    overview: true,
    sales: true,
    products: false,
    customers: false,
    team: false,
    analytics: false,
  });

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  // Auth related computed properties
  protected readonly isAuthenticated = computed(() => this.authService.getIsAuthenticated()());
  protected readonly currentUser = computed(() => this.authService.getCurrentUser()());
  protected readonly userRole = computed(() => this.authService.userRole());
  protected readonly isAdmin = computed(() => this.authService.isAdmin());
  protected readonly isManager = computed(() => this.authService.isManager());
  protected readonly isStaff = computed(() => this.authService.isStaff());

  // Show all menu items (no permission filtering)
  protected readonly visibleMenuItems = computed(() => this.menuItems());

  // Grouped menu for compact sidebar
  protected readonly groupedMenu = computed(() => {
    const items = this.visibleMenuItems();
    const byId: Record<string, any> = Object.fromEntries(items.map((i) => [i.id, i]));
    return [
      {
        id: 'overview',
        label: 'Tổng quan',
        icon: '📋',
        items: [byId['dashboard']].filter(Boolean),
      },
      {
        id: 'sales',
        label: 'Bán hàng',
        icon: '🛒',
        items: [byId['pos'], byId['orders'], byId['invoices']].filter(Boolean),
      },
      {
        id: 'products',
        label: 'Sản phẩm & kho',
        icon: '📦',
        items: [byId['products'], byId['inventory'], byId['reviews']].filter(Boolean),
      },
      {
        id: 'customers',
        label: 'Khách hàng & ưu đãi',
        icon: '👥',
        items: [byId['customers'], byId['loyalty'], byId['coupons']].filter(Boolean),
      },
      {
        id: 'team',
        label: 'Nhân sự',
        icon: '🧑‍💼',
        items: [byId['staff']].filter(Boolean),
      },
      {
        id: 'analytics',
        label: 'Báo cáo',
        icon: '📈',
        items: [byId['reports']].filter(Boolean),
      },
    ];
  });

  protected navigateTo(route: string) {
    this.router.navigate([route]);
    this.sidebarOpen.set(false); // Close sidebar on mobile after navigation
  }

  protected isActiveRoute(route: string): boolean {
    return this.currentRoute().startsWith(route);
  }

  protected toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  protected closeSidebar() {
    this.sidebarOpen.set(false);
  }

  protected logout() {
    this.authService.logout();
  }

  protected toggleGroup(groupId: string) {
    const current = this.groupOpenState();
    this.groupOpenState.set({ ...current, [groupId]: !current[groupId] });
  }

  protected isGroupOpen(groupId: string): boolean {
    return !!this.groupOpenState()[groupId];
  }

  protected getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      admin: 'Quản trị viên',
      manager: 'Quản lý cửa hàng',
      staff: 'Nhân viên',
    };
    return roleNames[role] || role;
  }
}
