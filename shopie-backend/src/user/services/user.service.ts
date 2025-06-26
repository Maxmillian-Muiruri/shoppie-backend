/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $Enums, UserRole } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail-service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        role:
          (createUserDto.role && typeof createUserDto.role === 'string'
            ? (createUserDto.role.toUpperCase() as keyof typeof UserRole)
            : undefined) || UserRole.CUSTOMER,
      },
    });
    await this.mailService.sendWelcomeEmail(user.email, user.name);
    const adminEmail = this.configService.get<string>(
      'ADMIN_EMAIL',
      'admin@shoppie.com',
    );
    await this.mailService.sendAdminNewUserEmail(
      adminEmail,
      user.name,
      user.email,
    );
    return this.mapToUserResponse(user);
  }

  async findAllUsers() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.mapToUserResponse(user));
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.mapToUserResponse(user);
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        resetPasswordCode: true,
        resetPasswordCodeExpiry: true,
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }
    let password = user.password;
    if (updateUserDto.password) {
      password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name ?? user.name,
        email: updateUserDto.email ?? user.email,
        password,
        resetPasswordCode:
          updateUserDto.resetPasswordCode ?? user.resetPasswordCode ?? null,
        resetPasswordCodeExpiry:
          updateUserDto.resetPasswordCodeExpiry ??
          user.resetPasswordCodeExpiry ??
          null,
      },
    });
    await this.mailService.sendProfileUpdatedEmail(updated.email, updated.name);
    return this.mapToUserResponse(updated);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
  }

  private mapToUserResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      resetPasswordCode: user.resetPasswordCode,
      resetPasswordCodeExpiry: user.resetPasswordCodeExpiry,
    };
  }
}
