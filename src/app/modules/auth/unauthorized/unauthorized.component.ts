import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  constructor(private authService: AuthService, private router: Router) {}

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected logout(): void {
    this.authService.logout();
  }

  protected getCurrentUser() {
    return this.authService.getCurrentUser()();
  }
}
