import { Resolver, Query, Mutation, Args, ID, Float, Int } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Order, OrderItem } from '../models/order.model';

interface OrderService {
  createOrder(data: any): any;
  getOrder(data: any): any;
  updateOrderStatus(data: any): any;
  getOrders(data: any): any;
  getUserOrders(data: any): any;
}

@Resolver(() => Order)
export class OrderResolver implements OnModuleInit {
  private orderService: OrderService;

  constructor(@Inject('ORDER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>('OrderService');
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => ID }) id: string) {
    return await this.orderService.getOrder({ id });
  }

  @Query(() => [Order])
  async orders(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    const result = await this.orderService.getOrders({ page, limit });
    return result.orders;
  }

  @Query(() => [Order])
  async userOrders(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    const result = await this.orderService.getUserOrders({ userId, page, limit });
    return result.orders;
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('items', { type: () => [OrderItemInput] }) items: OrderItemInput[],
    @Args('totalAmount', { type: () => Float }) totalAmount: number,
  ) {
    return await this.orderService.createOrder({ userId, items, totalAmount });
  }

  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: string,
  ) {
    return await this.orderService.updateOrderStatus({ id, status });
  }
}

// Input types for GraphQL
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}
