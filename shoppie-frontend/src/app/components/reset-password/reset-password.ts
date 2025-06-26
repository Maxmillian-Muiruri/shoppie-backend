import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  code = '';
  newPassword = '';
  loading = false;
  message = '';
  error = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  resetPassword() {
    this.loading = true;
    this.error = '';
    this.message = '';
    this.http.post('/auth/reset-password', {
      email: this.email,
      code: this.code,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.message = 'Password reset successful. You can now log in.';
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Something went wrong.';
        this.loading = false;
      }
    });
  }
} 