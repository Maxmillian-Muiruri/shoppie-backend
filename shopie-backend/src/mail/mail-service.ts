/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as ejs from 'ejs';

export interface EmailOptions {
  to: string;
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private templatesPath: string;

  constructor(private readonly configService: ConfigService) {
    this.templatesPath = path.join(process.cwd(), 'src/mail/templates');
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Debug logging for environment variables
    console.log('MAIL_USER:', this.configService.get<string>('MAIL_USER'));
    console.log('MAIL_PASS:', this.configService.get<string>('MAIL_PASS'));
    const smtpConfig = {
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: parseInt(this.configService.get<string>('MAIL_PORT', '587')),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
    this.logger.log('Mailer transporter initialized');
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      let html = options.html;

      if (options.template && options.context) {
        html = await this.renderTemplate(options.template, options.context);
      }

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'Project Manager <no-reply@example.com>'),
        to: options.to,
        subject: options.subject,
        html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to}: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
    }
  }

  async sendProjectAssignedEmail(to: string, projectName: string, endDate: string): Promise<void> {
    const context = {
      projectName,
      endDate: new Date(endDate).toDateString(),
    };

    const options: EmailOptions = {
      to,
      subject: `New Project Assigned: ${projectName}`,
      template: 'project-assigned', // should exist in /templates/email/project-assigned.ejs
      context,
    };

    await this.sendEmail(options);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const options: EmailOptions = {
      to,
      subject: 'Welcome to Project Manager',
      template: 'welcome-user',
      context: { name },
    };
    await this.sendEmail(options);
  }

  async sendAdminNewUserEmail(adminEmail: string, userName: string, userEmail: string): Promise<void> {
    const options: EmailOptions = {
      to: adminEmail,
      subject: 'New User Registration',
      template: 'admin-new-user',
      context: { userName, userEmail },
    };
    await this.sendEmail(options);
  }

  async sendProfileUpdatedEmail(to: string, name: string): Promise<void> {
    const options: EmailOptions = {
      to,
      subject: 'Your Shoppie Profile Was Updated',
      template: 'profile-updated',
      context: { name },
    };
    await this.sendEmail(options);
  }

  async sendOrderConfirmationEmail(
    to: string, 
    customerName: string, 
    orderId: string, 
    orderData: {
      status: string;
      totalAmount: number;
      shippingAddress: string;
      orderItems: Array<{
        productName: string;
        quantity: number;
        price: number;
      }>;
      createdAt: Date;
    }
  ): Promise<void> {
    const orderTrackingUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200')}/orders`;
    
    const context = {
      customerName,
      customerEmail: to,
      orderId: orderId.slice(0, 8), // Show only first 8 characters for cleaner display
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.orderItems,
      orderDate: orderData.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      orderTrackingUrl
    };

    const options: EmailOptions = {
      to,
      subject: `Order Confirmation #${orderId.slice(0, 8)} - Shoppie`,
      template: 'order-confirmation',
      context,
    };

    await this.sendEmail(options);
  }

  async sendAdminOrderNotificationEmail(
    adminEmail: string,
    orderData: {
      orderId: string;
      customerName: string;
      customerEmail: string;
      status: string;
      totalAmount: number;
      shippingAddress: string;
      orderItems: Array<{
        productName: string;
        quantity: number;
        price: number;
      }>;
      createdAt: Date;
    }
  ): Promise<void> {
    const adminDashboardUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200')}/admin`;
    const orderDetailsUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200')}/admin?tab=orders`;
    
    const context = {
      orderId: orderData.orderId.slice(0, 8), // Show only first 8 characters for cleaner display
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.orderItems,
      orderDate: orderData.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      adminDashboardUrl,
      orderDetailsUrl
    };

    const options: EmailOptions = {
      to: adminEmail,
      subject: `New Order #${orderData.orderId.slice(0, 8)} - Admin Notification`,
      template: 'admin-order-notification',
      context,
    };

    await this.sendEmail(options);
  }

  async sendOrderStatusUpdateEmail(
    customerEmail: string,
    customerName: string,
    orderData: {
      orderId: string;
      status: string;
      totalAmount: number;
      shippingAddress: string;
      orderItems: Array<{
        productName: string;
        quantity: number;
        price: number;
      }>;
      updatedAt: Date;
    }
  ): Promise<void> {
    const orderTrackingUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:4200')}/orders`;
    
    const context = {
      customerName,
      orderId: orderData.orderId.slice(0, 8), // Show only first 8 characters for cleaner display
      status: orderData.status,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      orderItems: orderData.orderItems,
      updatedAt: orderData.updatedAt,
      orderTrackingUrl
    };

    const options: EmailOptions = {
      to: customerEmail,
      subject: `Order Status Updated to ${orderData.status} - #${orderData.orderId.slice(0, 8)}`,
      template: 'order-status-update',
      context,
    };

    await this.sendEmail(options);
  }

  private async renderTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.ejs`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template "${templateName}" not found at ${templatePath}`);
      }

      const templateOptions = {
        filename: templatePath,
        cache: process.env.NODE_ENV === 'production',
        compileDebug: process.env.NODE_ENV !== 'production',
      };

      const html = await ejs.renderFile(templatePath, context, templateOptions);
      return html;
    } catch (error) {
      this.logger.error(`Template rendering failed: ${error.message}`);
      throw error;
    }
  }
}