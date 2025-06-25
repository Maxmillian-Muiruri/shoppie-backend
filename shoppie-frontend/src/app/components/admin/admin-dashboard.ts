import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductFormComponent } from './product-form';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFormComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];
  loading = false;
  error = '';
  showProductForm = false;
  editingProduct: Product | null = null;

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  addProduct(): void {
    this.editingProduct = null;
    this.showProductForm = true;
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.showProductForm = true;
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.fetchProducts();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete product.';
          this.loading = false;
        }
      });
    }
  }

  onProductSaved(): void {
    this.showProductForm = false;
    this.editingProduct = null;
    this.fetchProducts();
  }

  onCancel(): void {
    this.showProductForm = false;
    this.editingProduct = null;
  }
} 