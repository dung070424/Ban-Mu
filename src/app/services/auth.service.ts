import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isAuthenticated = signal(false);
  private readonly token = signal<string | null>(null);

  // Dữ liệu user mẫu
  private readonly users: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@banmu.com',
      fullName: 'Quản trị viên',
      role: 'admin',
      avatar: '👨‍💼',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      username: 'manager',
      email: 'manager@banmu.com',
      fullName: 'Nguyễn Văn Quản lý',
      role: 'manager',
      avatar: '👨‍💻',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      username: 'staff',
      email: 'staff@banmu.com',
      fullName: 'Trần Thị Nhân viên',
      role: 'staff',
      avatar: '👩‍💼',
      isActive: true,
      lastLogin: new Date(),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  constructor(private router: Router) {
    // Kiểm tra token trong localStorage khi khởi tạo
    this.checkStoredAuth();
  }

  // Getters
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  getIsAuthenticated() {
    return this.isAuthenticated.asReadonly();
  }

  getToken() {
    return this.token.asReadonly();
  }

  // Computed properties
  readonly userRole = computed(() => this.currentUser()?.role || null);
  readonly isAdmin = computed(() => this.userRole() === 'admin');
  readonly isManager = computed(() => this.userRole() === 'manager');
  readonly isStaff = computed(() => this.userRole() === 'staff');
  readonly canManageUsers = computed(() => this.isAdmin() || this.isManager());
  readonly canManageProducts = computed(() => this.isAdmin() || this.isManager());
  readonly canViewReports = computed(() => this.isAdmin() || this.isManager());

  // Đăng nhập
  login(credentials: LoginRequest): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      // Simulate API call delay
      setTimeout(() => {
        const user = this.users.find((u) => u.username === credentials.username && u.isActive);

        if (!user) {
          reject(new Error('Tên đăng nhập không tồn tại hoặc đã bị vô hiệu hóa'));
          return;
        }

        // Simulate password check (in real app, this would be server-side)
        if (credentials.password !== '123456') {
          reject(new Error('Mật khẩu không chính xác'));
          return;
        }

        // Generate token (in real app, this would come from server)
        const token = this.generateToken();
        const expiresIn = 24 * 60 * 60 * 1000; // 24 hours

        // Update user last login
        user.lastLogin = new Date();

        // Set authentication state
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.token.set(token);

        // Store in localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(user));
        }

        const response: LoginResponse = {
          user,
          token,
          expiresIn,
        };

        resolve(response);
      }, 1000);
    });
  }

  // Đăng xuất
  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.token.set(null);

    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }

    // Redirect to login
    this.router.navigate(['/login']);
  }

  // Kiểm tra quyền truy cập
  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;

    const permissions = this.getRolePermissions(user.role);
    return permissions.includes(permission);
  }

  // Lấy danh sách quyền theo role
  private getRolePermissions(role: string): string[] {
    const permissions: { [key: string]: string[] } = {
      admin: [
        'pos.sell',
        'products.view',
        'products.create',
        'products.edit',
        'products.delete',
        'customers.view',
        'customers.create',
        'customers.edit',
        'customers.delete',
        'staff.view',
        'staff.create',
        'staff.edit',
        'staff.delete',
        'coupons.view',
        'coupons.create',
        'coupons.edit',
        'coupons.delete',
        'reports.view',
        'invoices.view',
        'users.manage',
      ],
      manager: [
        'pos.sell',
        'products.view',
        'products.create',
        'products.edit',
        'products.delete',
        'customers.view',
        'customers.create',
        'customers.edit',
        'customers.delete',
        'staff.view',
        'staff.create',
        'staff.edit',
        'coupons.view',
        'coupons.create',
        'coupons.edit',
        'reports.view',
        'invoices.view',
      ],
      staff: [
        'pos.sell',
        'products.view',
        'customers.view',
        'customers.create',
        'customers.edit',
        'invoices.view',
      ],
    };

    return permissions[role] || [];
  }

  // Kiểm tra token trong localStorage
  private checkStoredAuth(): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        this.token.set(token);
      } catch (error) {
        // Clear invalid data
        this.clearStoredAuth();
      }
    }
  }

  // Xóa dữ liệu auth khỏi localStorage
  private clearStoredAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Tạo token giả (trong thực tế sẽ do server tạo)
  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Cập nhật thông tin user
  updateUser(updatedUser: User): void {
    this.currentUser.set(updatedUser);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  }
}
