import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  product: Product | null = null;
  loading = false;
  error = '';
  addToCartMessage = '';
  quantity = 1;
  addingToCart = false;

  ngOnInit(): void {
    this.loading = true;
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      this.fetchProduct(productId);
    } else {
      this.error = 'Product not found';
      this.loading = false;
    }
  }

  fetchProduct(productId: string): void {
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load product';
        this.loading = false;
        // Fallback to mock data if API fails
        this.loadMockProduct(productId);
      }
    });
  }

  addToCart(): void {
    if (!this.product || this.quantity < 1) return;
    
    this.addingToCart = true;
    this.addToCartMessage = '';
    
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: (cartItem) => {
        this.addingToCart = false;
        this.addToCartMessage = `Added ${this.quantity} item(s) to cart!`;
        console.log('Added to cart:', cartItem);
      },
      error: (error) => {
        this.addingToCart = false;
        this.addToCartMessage = error.error?.message || 'Failed to add to cart';
        console.error('Add to cart error:', error);
      }
    });
  }

  editProduct() {
    // TODO: Implement edit logic (admin only)
    alert('Edit product (admin only)');
  }

  deleteProduct() {
    // TODO: Implement delete logic (admin only)
    alert('Delete product (admin only)');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private loadMockProduct(productId: string): void {
    // Fallback mock data if API is not available
    this.product = {
      id: productId,
      name: `Product ${productId}`,
      price: 99.99,
      shortDescription: `This is a detailed description for product ${productId}. It includes all the important features and specifications that customers need to know.`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=',
      stockQuantity: 10
    };
  }
} 