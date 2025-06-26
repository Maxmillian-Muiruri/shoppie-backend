import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [UserModule, ProductModule, CartModule, AuthModule, CloudinaryModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
