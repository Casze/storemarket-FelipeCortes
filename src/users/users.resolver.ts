// Importamos las dependencias necesarias para el resolver.
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';

// Decorador que marca la clase como un Resolver asociado a la entidad User.
@Resolver(() => User)
export class UsersResolver {
  
  // Constructor de la clase.
  // Inyectamos los servicios UsersService y ProductsService.
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService
  ) {}

  // Mutación para crear un nuevo usuario.
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  // Consulta que retorna todos los usuarios.
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  // Consulta que busca y retorna un usuario por su nombre.
  @Query(() => User, { name: 'user' })
  findOne(@Args('name', { type: () => String }) name: string) {
    return this.usersService.findOne(name);
  }

  // Mutación para registrar un nuevo usuario.
  @Mutation(() => User)
  async register(@Args('input') input: CreateUserInput): Promise<User> {
    return this.usersService.register(input);
  }

  // Mutación para desvincular un producto de un usuario.
  @Mutation(() => Boolean)
  async removeProductFromUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    return this.usersService.removeProductFromUser(userId, productId);
  }

  // Mutación para asignar un producto a un usuario.
  @Mutation(() => Product)
  async addProductToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.addProductToUser(userId, productId);
  }
}
