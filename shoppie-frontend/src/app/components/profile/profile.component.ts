import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error = '';
  editMode = false;
  profileForm: FormGroup;
  updateMessage = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser(): void {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue(user);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
    this.updateMessage = '';
  }

  cancelEdit() {
    this.editMode = false;
    this.profileForm.patchValue(this.user!);
    this.updateMessage = '';
  }

  saveProfile() {
    if (!this.user) return;
    if (this.profileForm.invalid) return;
    this.userService.updateUser(this.user.id, this.profileForm.value).subscribe({
      next: (updated) => {
        this.user = updated;
        this.editMode = false;
        this.updateMessage = 'Profile updated!';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile.';
      }
    });
  }
} 