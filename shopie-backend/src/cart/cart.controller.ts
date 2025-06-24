import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './services/cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @CurrentUser() user: any,
    @Body() dto: AddToCartDto,
  ): Promise<CartItemResponseDto> {
    return this.cartService.addToCart(user.userId, dto);
  }

  @Get()
  async getCart(@CurrentUser() user: any): Promise<CartItemResponseDto[]> {
    return this.cartService.getCart(user.userId);
  }

  @Delete('remove/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.cartService.removeFromCart(user.userId, productId);
  }

  @Put('update')
  async updateCartItem(
    @CurrentUser() user: any,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return this.cartService.updateCartItem(user.userId, dto);
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async checkout(@CurrentUser() user: any) {
    await this.cartService.clearCart(user.userId);
    return { message: 'Purchase successful! Your cart is now empty.' };
  }
}
