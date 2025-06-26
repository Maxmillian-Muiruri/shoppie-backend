import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()"></div>
    <div class="modal-card">
      <button class="close-btn" (click)="onClose()">&times;</button>
      <h2>Order #{{ order?.id.slice(0, 8) }}</h2>
      <div class="order-status">
        <span class="status-badge" [class]="'status-' + order?.status.toLowerCase()">{{ order?.status }}</span>
        <span class="order-date">Placed: {{ order?.createdAt | date:'medium' }}</span>
      </div>
      <div class="shipping-info">
        <strong>Shipping Address:</strong>
        <p>{{ order?.shippingAddress }}</p>
      </div>
      <div class="order-items">
        <h3>Items</h3>
        <div class="order-item" *ngFor="let item of order?.orderItems">
          <div class="item-name">{{ item.productName }}</div>
          <div class="item-qty">Qty: {{ item.quantity }}</div>
          <div class="item-price">Price: {{ item.price | currency }}</div>
          <div class="item-total">Total: {{ (item.price * item.quantity) | currency }}</div>
        </div>
      </div>
      <div class="order-summary">
        <div><strong>Total:</strong> {{ order?.totalAmount | currency }}</div>
      </div>
    </div>
  `,
  styleUrls: ['./order-details-modal.css']
})
export class OrderDetailsModalComponent {
  @Input() order: Order | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
} 