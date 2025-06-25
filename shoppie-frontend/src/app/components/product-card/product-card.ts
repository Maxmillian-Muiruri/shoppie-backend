import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  private router = inject(Router);
  private cartService = inject(CartService);
  
  @Input() product!: Product;
  addingToCart = false;
  addToCartMessage = '';

  constructor() {}

  goToDetail() {
    this.router.navigate(['/products', this.product.id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation(); // Prevent navigation to product detail
    
    this.addingToCart = true;
    this.addToCartMessage = '';
    
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: (cartItem) => {
        this.addingToCart = false;
        this.addToCartMessage = 'Added to cart!';
        console.log('Added to cart:', cartItem);
        
        // Clear message after 2 seconds
        setTimeout(() => {
          this.addToCartMessage = '';
        }, 2000);
      },
      error: (error) => {
        this.addingToCart = false;
        this.addToCartMessage = 'Failed to add to cart';
        console.error('Add to cart error:', error);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.addToCartMessage = '';
        }, 3000);
      }
    });
  }
} 