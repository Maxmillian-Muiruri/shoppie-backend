import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './services/cart.service';
import { ProductModule } from '../product/product.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ProductModule, PrismaModule, UserModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
