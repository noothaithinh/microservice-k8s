import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: { name: string; email: string; password: string }) {
    const user = await this.userService.createUser(data);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: { id: string }) {
    const user = await this.userService.findById(data.id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'GetUsers')
  async getUsers(data: { page: number; limit: number }) {
    const { users, total } = await this.userService.findAll(data.page, data.limit);
    return {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
      total,
      page: data.page,
      limit: data.limit,
    };
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: { id: string; name?: string; email?: string }) {
    const user = await this.userService.updateUser(data.id, {
      name: data.name,
      email: data.email,
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: { id: string }) {
    const success = await this.userService.deleteUser(data.id);
    return {
      success,
      message: success ? 'User deleted successfully' : 'User not found',
    };
  }
}
