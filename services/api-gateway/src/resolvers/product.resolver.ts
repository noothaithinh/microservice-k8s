import { Resolver, Query, Mutation, Args, ID, Float, Int } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Product } from '../models/product.model';

interface ProductService {
  createProduct(data: any): any;
  getProduct(data: any): any;
  updateProduct(data: any): any;
  deleteProduct(data: any): any;
  getProducts(data: any): any;
}

@Resolver(() => Product)
export class ProductResolver implements OnModuleInit {
  private productService: ProductService;

  constructor(@Inject('PRODUCT_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => ID }) id: string) {
    return await this.productService.getProduct({ id });
  }

  @Query(() => [Product])
  async products(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('category', { nullable: true }) category?: string,
  ) {
    const result = await this.productService.getProducts({ page, limit, category });
    return result.products;
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('price', { type: () => Float }) price: number,
    @Args('stock', { type: () => Int }) stock: number,
    @Args('category') category: string,
  ) {
    return await this.productService.createProduct({ name, description, price, stock, category });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('price', { type: () => Float, nullable: true }) price?: number,
    @Args('stock', { type: () => Int, nullable: true }) stock?: number,
    @Args('category', { nullable: true }) category?: string,
  ) {
    return await this.productService.updateProduct({ id, name, description, price, stock, category });
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', { type: () => ID }) id: string) {
    const result = await this.productService.deleteProduct({ id });
    return result.success;
  }
}
