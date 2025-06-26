import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  
  cart: Cart | null = null;
  loading = false;
  error = '';
  updating = false;
  checkoutMessage = '';

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart(): void {
    this.loading = true;
    this.error = '';
    
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load cart';
        this.loading = false;
        console.error('Cart fetch error:', error);
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;
    
    this.updating = true;
    this.error = '';
    
    this.cartService.updateCartItem(item.productId, quantity).subscribe({
      next: (updatedItem) => {
        this.updating = false;
        this.fetchCart(); // Refresh cart to get updated totals
      },
      error: (error) => {
        this.updating = false;
        this.error = error.error?.message || 'Failed to update quantity';
        console.error('Update quantity error:', error);
      }
    });
  }

  removeItem(item: CartItem) {
    this.updating = true;
    this.error = '';
    
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => {
        this.updating = false;
        this.fetchCart(); // Refresh cart to get updated totals
      },
      error: (error) => {
        this.updating = false;
        this.error = error.error?.message || 'Failed to remove item';
        console.error('Remove item error:', error);
      }
    });
  }

  checkout() {
    if (!this.cart || this.cart.items.length === 0) return;
    
    // Navigate to checkout page instead of calling checkout API
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  get isCartEmpty(): boolean {
    return !this.cart || this.cart.items.length === 0;
  }
} 