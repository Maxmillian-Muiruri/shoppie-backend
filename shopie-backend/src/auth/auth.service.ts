import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/services/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail-service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    console.log('User from findByEmail:', user);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', passwordMatch);
      if (passwordMatch) {
        // Exclude password from returned user
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) return; // Do not reveal if user exists
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.userService.updateUser(user.id, {
      resetPasswordCode: code,
      resetPasswordCodeExpiry: expiry,
    });
    await this.mailService.sendEmail({
      to: user.email,
      subject: 'Your Password Reset Code',
      html: `<p>Your password reset code is: <b>${code}</b></p><p>This code will expire in 10 minutes.</p>`
    });
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    if (!user || !user.resetPasswordCode || !user.resetPasswordCodeExpiry) return false;
    const now = new Date();
    if (
      user.resetPasswordCode !== code ||
      user.resetPasswordCodeExpiry.getTime() < now.getTime()
    ) {
      return false;
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(user.id, {
      password: hashed,
      resetPasswordCode: null,
      resetPasswordCodeExpiry: null,
    });
    return true;
  }
}
