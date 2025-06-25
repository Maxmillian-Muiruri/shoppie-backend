import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductService, Product } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  products: Product[] = [];
  loading = false;
  error = '';
  searchTerm = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const search = params['search'] || '';
      this.searchTerm = search;
      this.fetchProducts(search);
    });
  }

  fetchProducts(search?: string): void {
    this.loading = true;
    this.error = '';

    const observable = search 
      ? this.productService.searchProducts(search)
      : this.productService.getAllProducts();

    observable.subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load products';
        this.loading = false;
        // Fallback to mock data if API fails
        this.loadMockProducts();
      }
    });
  }

  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate([], { queryParams: { search: this.searchTerm.trim() } });
    } else {
      this.router.navigate([], { queryParams: {} });
    }
  }

  private loadMockProducts(): void {
    // Fallback mock data if API is not available
    this.products = [
      { 
        id: '1', 
        name: 'Test Product 1', 
        price: 99.99, 
        shortDescription: 'This is a test product description for product 1', 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=' 
      },
      { 
        id: '2', 
        name: 'Test Product 2', 
        price: 149.99, 
        shortDescription: 'This is a test product description for product 2', 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=' 
      },
      { 
        id: '3', 
        name: 'Test Product 3', 
        price: 79.99, 
        shortDescription: 'This is a test product description for product 3', 
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2R1Y3QgSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=' 
      }
    ];
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.router.navigate([], { queryParams: {} });
  }
} 