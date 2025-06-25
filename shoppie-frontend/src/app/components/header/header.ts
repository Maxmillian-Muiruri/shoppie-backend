import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  
  cartCount = 0;
  isLoggedIn = false;
  isAdmin = false;
  searchTerm = '';

  constructor() {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
      
      // Load cart when user is logged in
      if (this.isLoggedIn) {
        this.loadCartCount();
      } else {
        this.cartCount = 0;
      }
    });
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartCount = cart.totalItems;
      },
      error: (error) => {
        console.error('Failed to load cart count:', error);
        this.cartCount = 0;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.cartCount = 0;
    this.router.navigate(['/']);
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/'], { queryParams: { search: this.searchTerm.trim() } });
    } else {
      this.router.navigate(['/']);
    }
  }
} 