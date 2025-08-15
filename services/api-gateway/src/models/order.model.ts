import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  productId: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Float)
  totalAmount: number;

  @Field()
  status: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
