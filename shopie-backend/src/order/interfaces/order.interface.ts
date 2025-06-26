import { OrderStatus } from '../../../shared/enums/order-status.enum';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
} 