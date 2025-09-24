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
    redirectTo: '/pos',
    pathMatch: 'full',
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
    path: 'staff',
    loadComponent: () => import('./modules/staff/staff.component').then((m) => m.StaffComponent),
    canActivate: [AuthGuard],
    data: { permission: 'staff.view' },
  },
  {
    path: 'coupons',
    loadComponent: () =>
      import('./modules/coupons/coupons.component').then((m) => m.CouponsComponent),
    canActivate: [AuthGuard],
    data: { permission: 'coupons.view' },
  },
  {
    path: 'customers',
    loadComponent: () =>
      import('./modules/customers/customers.component').then((m) => m.CustomersComponent),
    canActivate: [AuthGuard],
    data: { permission: 'customers.view' },
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
