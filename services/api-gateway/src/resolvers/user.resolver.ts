import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User } from '../models/user.model';

interface UserService {
  createUser(data: any): any;
  getUser(data: any): any;
  updateUser(data: any): any;
  deleteUser(data: any): any;
  getUsers(data: any): any;
}

@Resolver(() => User)
export class UserResolver implements OnModuleInit {
  private userService: UserService;

  constructor(@Inject('USER_SERVICE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Query(() => User)
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.userService.getUser({ id });
  }

  @Query(() => [User])
  async users(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 10 }) limit: number,
  ) {
    const result = await this.userService.getUsers({ page, limit });
    return result.users;
  }

  @Mutation(() => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.userService.createUser({ name, email, password });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('email', { nullable: true }) email?: string,
  ) {
    return this.userService.updateUser({ id, name, email });
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    const result = await this.userService.deleteUser({ id });
    return result.success;
  }
}
