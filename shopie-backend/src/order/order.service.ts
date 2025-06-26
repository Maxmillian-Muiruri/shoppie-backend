import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail-service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../../shared/enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Get user's cart items
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Get user information for email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    // Create order with transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          status: OrderStatus.PENDING,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map((cartItem) =>
          prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              price: cartItem.product.price,
            },
          })
        )
      );

      // Update product stock
      await Promise.all(
        cartItems.map((cartItem) =>
          prisma.product.update({
            where: { id: cartItem.productId },
            data: {
              stockQuantity: {
                decrement: cartItem.quantity,
              },
            },
          })
        )
      );

      // Clear user's cart
      await prisma.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    // Get the complete order with items for email
    const completeOrder = await this.getOrderById(order.id);

    // Send order confirmation email
    try {
      await this.mailService.sendOrderConfirmationEmail(
        user.email,
        user.name,
        completeOrder.id,
        {
          status: completeOrder.status,
          totalAmount: completeOrder.totalAmount,
          shippingAddress: completeOrder.shippingAddress,
          orderItems: completeOrder.orderItems,
          createdAt: completeOrder.createdAt,
        }
      );
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send order confirmation email:', error);
    }

    // Send admin notification email
    try {
      // Send notification to specific admin email
      await this.mailService.sendAdminOrderNotificationEmail(
        'maxmillianmuiruri@gmail.com',
        {
          orderId: completeOrder.id,
          customerName: user.name,
          customerEmail: user.email,
          status: completeOrder.status,
          totalAmount: completeOrder.totalAmount,
          shippingAddress: completeOrder.shippingAddress,
          orderItems: completeOrder.orderItems,
          createdAt: completeOrder.createdAt,
        }
      );
    } catch (error) {
      // Log error but don't fail the order creation
      console.error('Failed to send admin notification email:', error);
    }

    return completeOrder;
  }

  async getOrderById(orderId: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
      })),
    };
  }

  async getUserOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
      })),
    }));
  }

  async getAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      user: order.user ? {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
      } : undefined,
      status: order.status as OrderStatus,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.createdAt,
      })),
    }));
  }

  async updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    // Get the order with user details before updating
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // Update the order status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: updateOrderStatusDto.status,
      },
    });

    // Send status update email for specific statuses
    const statusesToNotify = ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    if (statusesToNotify.includes(updateOrderStatusDto.status)) {
      try {
        await this.mailService.sendOrderStatusUpdateEmail(
          existingOrder.user.email,
          existingOrder.user.name,
          {
            orderId: updatedOrder.id,
            status: updatedOrder.status,
            totalAmount: updatedOrder.totalAmount,
            shippingAddress: updatedOrder.shippingAddress,
            orderItems: existingOrder.orderItems.map((item) => ({
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price,
            })),
            updatedAt: updatedOrder.updatedAt,
          }
        );
      } catch (error) {
        // Log error but don't fail the status update
        console.error('Failed to send order status update email:', error);
      }
    }

    return this.getOrderById(orderId);
  }
}