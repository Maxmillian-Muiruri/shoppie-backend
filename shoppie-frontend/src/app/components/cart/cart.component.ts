import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  error = '';
  updating = false;
  checkoutMessage = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load cart.';
        this.loading = false;
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;
    this.updating = true;
    this.cartService.updateCartItem(item.productId, quantity).subscribe({
      next: () => { this.fetchCart(); this.updating = false; },
      error: (err) => { this.error = err.error?.message || 'Failed to update cart.'; this.updating = false; }
    });
  }

  removeItem(item: CartItem) {
    this.updating = true;
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => { this.fetchCart(); this.updating = false; },
      error: (err) => { this.error = err.error?.message || 'Failed to remove item.'; this.updating = false; }
    });
  }

  checkout() {
    this.updating = true;
    this.cartService.checkout().subscribe({
      next: () => { this.checkoutMessage = 'Checkout successful!'; this.fetchCart(); this.updating = false; },
      error: (err) => { this.error = err.error?.message || 'Checkout failed.'; this.updating = false; }
    });
  }
} 