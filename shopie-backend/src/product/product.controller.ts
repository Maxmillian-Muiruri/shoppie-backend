import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './services/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductResponse } from './interfaces/product.interface';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<IProductResponse> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async findAllProducts(
    @Query('search') search?: string,
  ): Promise<IProductResponse[]> {
    if (search) {
      return this.productService.searchProducts(search);
    }
    return this.productService.findAllProducts();
  }

  @Get(':id')
  async findProductById(@Param('id') id: string): Promise<IProductResponse> {
    return this.productService.findProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<IProductResponse> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
