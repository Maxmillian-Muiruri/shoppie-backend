import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addToCart(productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { productId, quantity }, { headers: this.getAuthHeaders() });
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { productId, quantity }, { headers: this.getAuthHeaders() });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`, { headers: this.getAuthHeaders() });
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, {}, { headers: this.getAuthHeaders() });
  }
} 