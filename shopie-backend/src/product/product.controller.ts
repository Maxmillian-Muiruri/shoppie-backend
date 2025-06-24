import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './services/product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductResponse } from './interfaces/product.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return { imageUrl };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, AdminGuard)
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
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<IProductResponse> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
