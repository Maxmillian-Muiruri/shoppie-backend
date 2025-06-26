import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';
import { OrderDetailsModalComponent } from './order-details-modal';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderDetailsModalComponent],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  selectedOrder: Order | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  viewOrderDetails(orderId: string): void {
    const found = this.orders.find(o => o.id === orderId);
    if (found) {
      this.selectedOrder = found;
    }
  }

  closeModal(): void {
    this.selectedOrder = null;
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }
} 