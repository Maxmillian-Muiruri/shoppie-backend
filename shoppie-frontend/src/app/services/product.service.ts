import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(search?: string): Observable<Product[]> {
    const url = search ? `${this.apiUrl}?search=${encodeURIComponent(search)}` : this.apiUrl;
    return this.http.get<Product[]>(url);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: any, token: string): Observable<Product> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  updateProduct(id: string, product: any, token: string): Observable<Product> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, { headers });
  }

  deleteProduct(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  uploadImage(file: File, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post('http://localhost:3000/products/upload', formData, { headers });
  }
} 