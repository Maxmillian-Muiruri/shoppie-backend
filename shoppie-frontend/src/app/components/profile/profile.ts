import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  
  user: User | null = null;
  editMode = false;
  loading = false;
  error = '';
  success = '';
  form = {
    name: '',
    email: '',
    password: ''
  };

  ngOnInit(): void {
    // 1. Load from local storage instantly
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.password = '';
    }
    // 2. Then fetch from backend for freshness
    this.loadUser();
  }

  loadUser() {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.form.name = user.name;
        this.form.email = user.email;
        this.form.password = '';
        this.loading = false;
        // Update local storage for next time
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load user info.';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
    this.success = '';
    this.error = '';
  }

  cancelEdit() {
    this.editMode = false;
    this.loadUser();
    this.success = '';
    this.error = '';
  }

  save() {
    if (!this.user) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const update: any = {
      name: this.form.name,
      email: this.form.email
    };
    if (this.form.password) {
      update.password = this.form.password;
    }
    this.userService.updateProfile(update).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.success = 'Profile updated successfully!';
        this.editMode = false;
        // Update local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.loadUser();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to update profile.';
      }
    });
  }
} 