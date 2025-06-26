import { OrderStatus } from '../../../shared/enums/order-status.enum';

export class OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export class UserInfoDto {
  id: string;
  name: string;
  email: string;
}

export class OrderResponseDto {
  id: string;
  userId: string;
  user?: UserInfoDto; // Optional for backward compatibility
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemResponseDto[];
} 