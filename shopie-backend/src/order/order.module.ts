import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail-module';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {} 