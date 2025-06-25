import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerData = {
    name: '',
    email: '',
    password: ''
  };
  loading = false;
  error = '';
  showPassword = false;
  success = '';

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Registration successful! Check your email for a welcome message.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2500);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Registration failed';
      }
    });
  }
} 