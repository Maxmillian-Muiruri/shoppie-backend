import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItemResponseDto } from '../dto/cart-item-response.dto';
import { ProductService } from '../../product/services/product.service';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async addToCart(
    userId: string,
    dto: AddToCartDto,
  ): Promise<CartItemResponseDto> {
    // Check user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    // Check product exists and is in stock
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stockQuantity < dto.quantity) {
      throw new ConflictException('Not enough stock');
    }
    // Decrement stock
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stockQuantity: { decrement: dto.quantity } },
    });
    // Check if item already in cart
    let cartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: dto.productId },
    });
    if (cartItem) {
      cartItem = await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: { increment: dto.quantity },
          addedAt: new Date(),
        },
      });
    } else {
      cartItem = await this.prisma.cartItem.create({
        data: {
          userId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }
    return this.mapToCartItemResponse(cartItem);
  }

  async getCart(userId: string): Promise<CartItemResponseDto[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    return Promise.all(
      cartItems.map((item) => this.mapToCartItemResponse(item)),
    );
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    // Restore stock
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (product) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: { increment: cartItem.quantity } },
      });
    }
    await this.prisma.cartItem.delete({ where: { id: cartItem.id } });
  }

  async updateCartItem(
    userId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { userId, productId: dto.productId },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stockQuantity + cartItem.quantity < dto.quantity) {
      throw new ConflictException('Not enough stock');
    }
    // Restore previous stock, then decrement new
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: {
        stockQuantity: { increment: cartItem.quantity },
      },
    });
    const updated = await this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        quantity: dto.quantity,
        addedAt: new Date(),
      },
    });
    return this.mapToCartItemResponse(updated);
  }

  private async mapToCartItemResponse(item: any): Promise<CartItemResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });
    return {
      id: item.id,
      productId: item.productId,
      name: product?.name ?? '',
      price: product?.price ?? 0,
      image: product?.image ?? '',
      quantity: item.quantity,
      addedAt: item.addedAt,
    };
  }
}
