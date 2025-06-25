import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail-module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, MailModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
