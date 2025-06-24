import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';
  addToCartMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProduct(id);
    }
  }

  fetchProduct(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load product.';
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (!this.product) return;
    this.addToCartMessage = '';
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => {
        this.addToCartMessage = 'Added to cart!';
      },
      error: (err) => {
        this.addToCartMessage = err.error?.message || 'Failed to add to cart.';
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
} 