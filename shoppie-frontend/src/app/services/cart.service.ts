import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CartItem, Cart, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';

@Injectable({ 
  providedIn: 'root' 
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cart';

  getCart(): Observable<Cart> {
    return this.http.get<CartItem[]>(this.apiUrl).pipe(
      map(items => this.calculateCartTotals(items))
    );
  }

  addToCart(productId: string, quantity: number): Observable<CartItem> {
    const request: AddToCartRequest = { productId, quantity };
    return this.http.post<CartItem>(`${this.apiUrl}/add`, request);
  }

  updateCartItem(productId: string, quantity: number): Observable<CartItem> {
    const request: UpdateCartItemRequest = { productId, quantity };
    return this.http.put<CartItem>(`${this.apiUrl}/update`, request);
  }

  removeFromCart(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${productId}`);
  }

  checkout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/checkout`, {});
  }

  private calculateCartTotals(items: CartItem[]): Cart {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice
    };
  }
} 