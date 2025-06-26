import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductFormComponent } from './product-form';
import { ProductService, Product } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductFormComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  
  products: Product[] = [];
  orders: Order[] = [];
  loading = false;
  error = '';
  showProductForm = false;
  editingProduct: Product | null = null;
  activeTab: 'products' | 'orders' = 'products';

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchOrders();
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

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
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

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(orderId, { status: newStatus }).subscribe({
      next: (updatedOrder) => {
        // Update the order in the local array
        const index = this.orders.findIndex(order => order.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        // Remove from view if delivered or cancelled
        if (updatedOrder.status === OrderStatus.DELIVERED || updatedOrder.status === OrderStatus.CANCELLED) {
          this.orders = this.orders.filter(order => order.id !== orderId);
        }
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
        alert('Failed to update order status. Please try again.');
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status.toLowerCase()}`;
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

  setActiveTab(tab: 'products' | 'orders'): void {
    this.activeTab = tab;
  }

  get activeOrders(): Order[] {
    return this.orders.filter(order => order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED);
  }
} 