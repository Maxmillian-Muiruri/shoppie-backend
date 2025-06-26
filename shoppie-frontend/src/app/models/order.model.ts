export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: UserInfo; // Optional for backward compatibility
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