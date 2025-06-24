import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  showForm = false;
  editingProduct: Product | null = null;
  formLoading = false;
  formError = '';

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
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

  openCreateForm() {
    this.editingProduct = null;
    this.showForm = true;
    this.formError = '';
  }

  openEditForm(product: Product) {
    this.editingProduct = product;
    this.showForm = true;
    this.formError = '';
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
    this.formError = '';
  }

  handleFormSubmit(formValue: any) {
    this.formLoading = true;
    this.formError = '';
    const token = this.authService.getToken() || '';
    const saveProduct = (imageUrl?: string) => {
      const productData = { ...formValue, imageUrl: imageUrl || formValue.imageUrl };
      if (this.editingProduct) {
        this.productService.updateProduct(this.editingProduct.id, productData, token).subscribe({
          next: () => { this.closeForm(); this.fetchProducts(); this.formLoading = false; },
          error: (err) => { this.formError = err.error?.message || 'Failed to update product.'; this.formLoading = false; }
        });
      } else {
        this.productService.createProduct(productData, token).subscribe({
          next: () => { this.closeForm(); this.fetchProducts(); this.formLoading = false; },
          error: (err) => { this.formError = err.error?.message || 'Failed to create product.'; this.formLoading = false; }
        });
      }
    };
    if (formValue.imageFile) {
      this.productService.uploadImage(formValue.imageFile, token).subscribe({
        next: (res) => saveProduct(res.url),
        error: (err) => { this.formError = err.error?.message || 'Image upload failed.'; this.formLoading = false; }
      });
    } else {
      saveProduct();
    }
  }

  deleteProduct(product: Product) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const token = this.authService.getToken() || '';
    this.productService.deleteProduct(product.id, token).subscribe({
      next: () => this.fetchProducts(),
      error: (err) => alert(err.error?.message || 'Failed to delete product.')
    });
  }
} 