import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-password-reset.html',
  styleUrl: './request-password-reset.css'
})
export class RequestPasswordResetComponent {
  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  requestReset() {
    this.loading = true;
    this.error = '';
    this.message = '';
    this.http.post('/auth/request-password-reset', { email: this.email })
      .subscribe({
        next: () => {
          this.message = 'If the email exists, a reset code has been sent.';
          this.loading = false;
          setTimeout(() => {
            this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
          }, 1500);
        },
        error: err => {
          this.error = err.error?.message || 'Something went wrong.';
          this.loading = false;
        }
      });
  }
} 