import { Component, signal, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../shared/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  protected readonly loginForm = signal<LoginRequest>({
    username: '',
    password: '',
  });

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Khóa cuộn khi ở màn đăng nhập
    this.document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Khôi phục cuộn khi rời màn đăng nhập
    this.document.body.style.overflow = '';
  }

  protected onUsernameChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.loginForm.update((form) => ({ ...form, username: target.value }));
  }

  protected onPasswordChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.loginForm.update((form) => ({ ...form, password: target.value }));
  }

  protected async onSubmit(): Promise<void> {
    const form = this.loginForm();

    if (!form.username || !form.password) {
      this.errorMessage.set('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.login(form);
      this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected getRoleDescription(role: string): string {
    const descriptions: { [key: string]: string } = {
      admin: 'Quản trị viên - Toàn quyền truy cập',
      manager: 'Quản lý cửa hàng - Quản lý sản phẩm và nhân viên',
      staff: 'Nhân viên - Bán hàng và quản lý khách hàng',
    };
    return descriptions[role] || '';
  }

  protected getDemoAccounts(): Array<{
    username: string;
    password: string;
    role: string;
    description: string;
  }> {
    return [
      {
        username: 'admin',
        password: '123456',
        role: 'admin',
        description: this.getRoleDescription('admin'),
      },
      {
        username: 'manager',
        password: '123456',
        role: 'manager',
        description: this.getRoleDescription('manager'),
      },
      {
        username: 'staff',
        password: '123456',
        role: 'staff',
        description: this.getRoleDescription('staff'),
      },
    ];
  }
}
