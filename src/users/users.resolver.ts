import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService // Inyectando ProductsService aquí.
  ) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('name', { type: () => String }) name: string) {
    return this.usersService.findOne(name);
  }

  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.register(input);
  }

  @Mutation(() => Boolean)
  async removeProductFromUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    return this.usersService.removeProductFromUser(userId, productId);
  }

  @Mutation(() => Product)
  async addProductToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.addProductToUser(userId, productId);
  }
}
