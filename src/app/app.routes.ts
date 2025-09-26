import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./modules/auth/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./modules/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [AuthGuard],
    data: { permission: 'dashboard.view' },
  },
  {
    path: 'pos',
    loadComponent: () => import('./modules/pos/pos.component').then((m) => m.PosComponent),
    canActivate: [AuthGuard],
    data: { permission: 'pos.sell' },
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./modules/products/products.component').then((m) => m.ProductsComponent),
    canActivate: [AuthGuard],
    data: { permission: 'products.view' },
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./modules/inventory/inventory.component').then((m) => m.InventoryComponent),
    canActivate: [AuthGuard],
    data: { permission: 'inventory.view' },
  },
  {
    path: 'orders',
    loadComponent: () => import('./modules/orders/orders.component').then((m) => m.OrdersComponent),
    canActivate: [AuthGuard],
    data: { permission: 'orders.view' },
  },
  {
    path: 'staff',
    loadComponent: () => import('./modules/staff/staff.component').then((m) => m.StaffComponent),
    canActivate: [AuthGuard],
    data: { permission: 'staff.view' },
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./modules/customers/customers.component').then((m) => m.CustomersComponent),
    canActivate: [AuthGuard],
    data: { permission: 'customers.view' },
  },
  {
    path: 'coupons',
    loadComponent: () =>
      import('./modules/coupons/coupons.component').then((m) => m.CouponsComponent),
    canActivate: [AuthGuard],
    data: { permission: 'coupons.view' },
  },
  {
    path: 'loyalty',
    loadComponent: () =>
      import('./modules/loyalty/loyalty.component').then((m) => m.LoyaltyComponent),
    canActivate: [AuthGuard],
    data: { permission: 'loyalty.view' },
  },
  {
    path: 'reviews',
    loadComponent: () =>
      import('./modules/reviews/reviews.component').then((m) => m.ReviewsComponent),
    canActivate: [AuthGuard],
    data: { permission: 'reviews.view' },
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./modules/reports/reports.component').then((m) => m.ReportsComponent),
    canActivate: [AuthGuard],
    data: { permission: 'reports.view' },
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./modules/invoices/invoices.component').then((m) => m.InvoicesComponent),
    canActivate: [AuthGuard],
    data: { permission: 'invoices.view' },
  },
];
