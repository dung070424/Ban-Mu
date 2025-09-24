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
    { id: 'pos', label: 'Bán hàng', icon: '🛒', route: '/pos', permission: 'pos.sell' },
    {
      id: 'products',
      label: 'Quản lý sản phẩm',
      icon: '📦',
      route: '/products',
      permission: 'products.view',
    },
    {
      id: 'customers',
      label: 'Quản lý khách hàng',
      icon: '👤',
      route: '/customers',
      permission: 'customers.view',
    },
    {
      id: 'invoices',
      label: 'Quản lý hóa đơn',
      icon: '🧾',
      route: '/invoices',
      permission: 'invoices.view',
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
    { id: 'reports', label: 'Báo cáo', icon: '📊', route: '/reports', permission: 'reports.view' },
  ]);

  protected readonly currentRoute = signal('');
  protected readonly sidebarOpen = signal(false);

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

  // Filter menu items based on permissions
  protected readonly visibleMenuItems = computed(() => {
    return this.menuItems().filter((item) => {
      if (!item.permission) return true;
      return this.authService.hasPermission(item.permission);
    });
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

  protected getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      admin: 'Quản trị viên',
      manager: 'Quản lý cửa hàng',
      staff: 'Nhân viên',
    };
    return roleNames[role] || role;
  }
}
