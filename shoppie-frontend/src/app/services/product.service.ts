import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image?: string;
  stockQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  shortDescription: string;
  price: number;
  image?: string;
  stockQuantity?: number;
}

export interface UpdateProductRequest {
  name?: string;
  shortDescription?: string;
  price?: number;
  image?: string;
  stockQuantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: string, productData: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products?search=${encodeURIComponent(query)}`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post('http://localhost:3000/products/upload', formData);
  }
} 