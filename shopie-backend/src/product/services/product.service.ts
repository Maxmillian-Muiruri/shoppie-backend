import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { IProductResponse } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<IProductResponse> {
    const existing = await this.prisma.product.findFirst({
      where: { name: createProductDto.name },
    });

    if (existing) {
      throw new ConflictException('Product with this name already exists');
    }

    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return this.mapToProductResponse(product);
  }

  async findAllProducts(): Promise<IProductResponse[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.mapToProductResponse(p));
  }

  async findProductById(id: string): Promise<IProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapToProductResponse(product);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProductResponse> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    return this.mapToProductResponse(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id } });
  }

  async searchProducts(query: string): Promise<IProductResponse[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    if (!products.length) {
      throw new NotFoundException('No products found matching your search');
    }

    return products.map((p) => this.mapToProductResponse(p));
  }

  private mapToProductResponse(product: any): IProductResponse {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: product.id,
      name: product.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      shortDescription: product.shortDescription,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      price: product.price,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      image: product.image,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stockQuantity: product.stockQuantity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      createdAt: product.createdAt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      updatedAt: product.updatedAt,
    };
  }
}
