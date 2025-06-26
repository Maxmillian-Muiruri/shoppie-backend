import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  shippingAddress: string = '';
  isProcessing: boolean = false;
  successMessage: string = '';

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  placeOrder(): void {
    if (!this.shippingAddress.trim()) {
      alert('Please enter a shipping address');
      return;
    }

    this.isProcessing = true;
    const orderData: CreateOrderRequest = {
      shippingAddress: this.shippingAddress
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.isProcessing = false;
        this.successMessage = 'Order placed successfully! A confirmation email has been sent. Please check your email for more details.';
        this.cartItems = [];
        this.totalAmount = 0;
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
      }
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
} 