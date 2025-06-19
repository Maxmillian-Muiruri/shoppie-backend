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
} from '@nestjs/common';
import { CartService } from './services/cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItemResponseDto } from './dto/cart-item-response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // For now, userId is hardcoded for demo. Replace with @CurrentUser() in real app.
  private getUserId(req: any): string {
    return '1'; // Simulate logged-in user with id '1'
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Req() req,
    @Body() dto: AddToCartDto,
  ): Promise<CartItemResponseDto> {
    return this.cartService.addToCart(this.getUserId(req), dto);
  }

  @Get()
  async getCart(@Req() req): Promise<CartItemResponseDto[]> {
    return this.cartService.getCart(this.getUserId(req));
  }

  @Delete('remove/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromCart(
    @Req() req,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.cartService.removeFromCart(this.getUserId(req), productId);
  }

  @Put('update')
  async updateCartItem(
    @Req() req,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemResponseDto> {
    return this.cartService.updateCartItem(this.getUserId(req), dto);
  }
}
