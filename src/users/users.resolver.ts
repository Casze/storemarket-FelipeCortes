import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
//import { UseGuards } from '@nestjs/common';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
//import { Product } from 'src/products/entities/product.entity';

@Resolver(() => User)
//@UseGuards(new JwtAuthGuard())
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  //@UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }
  //@UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }
  //@UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('name', { type: () => String }) name: string) {
    return this.usersService.findOne(name);
  }
  //@UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.register(input);
  }
  /*@ResolveField(() => Product)
  product(@Parent() user: User): Promise<Product[]> {
    return this.usersService.getProduct(user.name);
  }*/
}
