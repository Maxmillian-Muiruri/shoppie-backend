import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
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

  async findAllProducts() {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.mapToProductResponse(p));
  }

  async findProductById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapToProductResponse(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return this.mapToProductResponse(updated);
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.prisma.product.delete({ where: { id } });
  }

  async searchProducts(query: string) {
    const q = query.toLowerCase();
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { shortDescription: { contains: q, mode: 'insensitive' } },
        ],
      },
    });
    if (!products.length) {
      throw new NotFoundException('No products found matching your search');
    }
    return products.map((p) => this.mapToProductResponse(p));
  }

  private mapToProductResponse(product: any) {
    return { ...product };
  }
}
