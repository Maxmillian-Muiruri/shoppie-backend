import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.createOrder(req.user.userId, createOrderDto);
  }

  @Get('my-orders')
  async getUserOrders(@Request() req): Promise<OrderResponseDto[]> {
    return this.orderService.getUserOrders(req.user.userId);
  }

  @Get(':id')
  async getOrderById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderById(id);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllOrders(): Promise<OrderResponseDto[]> {
    return this.orderService.getAllOrders();
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  async updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.updateOrderStatus(id, updateOrderStatusDto);
  }
} 