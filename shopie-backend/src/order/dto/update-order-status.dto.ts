import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../../shared/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
} 