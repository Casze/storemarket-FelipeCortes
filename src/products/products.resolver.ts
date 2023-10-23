// Importamos las dependencias necesarias.
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { User } from '../users/entities/user.entity';
import { FetchAndSaveProductsResponse } from './dto/fetch-products';
import { UpdateProductInput } from './dto/update-product.input';

// Definiendo el resolver para el producto.
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  // Definiendo una consulta que devuelve todos los productos.
  @Query(() => [Product], { name: 'products' })
  getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  // Definiendo una consulta que devuelve todos los productos.
  @Query(() => Product, { name: 'product' })
  getProductById(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productsService.findOneProduct(id);
  }

  // Definiendo una consulta que devuelve todos los productos.
  @Query(() => [Product], { name: 'productsByUser' })
  getProductsByUsername(@Args('name', { type: () => String }) name: string): Promise<Product[]> {
    return this.productsService.getProductsByUsername(name);
  }

  // Definiendo una consulta que devuelve todos los productos.
  @ResolveField(() => User, { name: 'user' })
  getUserByProduct(@Parent() product: Product): Promise<User> {
    return this.productsService.getUser(product.user.name);
  }
  
  // Definiendo una consulta que devuelve todos los productos.
  @Mutation(() => Product, { name: 'createProduct' })
  addNewProduct(@Args('productsInput') productsInput: CreateProductInput): Promise<Product> {
    return this.productsService.createProduct(productsInput);
  }

  // Definiendo una consulta que devuelve todos los productos.
  @Mutation(() => Product, { name: 'updateProduct' })
  modifyProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductInput);
  }

  // Definiendo una consulta que devuelve todos los productos.
  @Mutation(() => Boolean, { name: 'deleteProduct' })
  removeProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.productsService.deleteProduct(id);
  }

  // Mutación para obtener y guardar productos desde una fuente externa.
  @Mutation(() => FetchAndSaveProductsResponse, { name: 'fetchAndSaveProducts' })
  async fetchAndPersistProducts(): Promise<FetchAndSaveProductsResponse> {
    try {
      await this.productsService.fetchAndSaveProducts();
      return {
        success: true,
        message: 'Productos obtenidos y guardados exitosamente.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener y guardar productos: ' + error.message,
      };
    }
  }

  // Definiendo una mutación GraphQL que permite asignar un producto a un usuario.
  // Esta mutación retorna un objeto de tipo 'Product' tras la asignación.
  @Mutation(() => Product, { name: 'addProductToUser' })
  assignProductToUser(
    // Recibe el ID del usuario como argumento de la mutación.
    @Args('userId', { type: () => Int }) userId: number,
    // Recibe el ID del producto como argumento de la mutación.
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    // Invoca el método 'addProductToUser' del servicio 'productsService' para realizar la operación de asignación.
    return this.productsService.addProductToUser(userId, productId);
  }

  // Definiendo una mutación GraphQL que permite desvincular un producto de un usuario.
  // Esta mutación retorna un objeto de tipo 'Product' tras la desvinculación.
  @Mutation(() => Product, { name: 'removeProductFromUser' })
  unassignProductFromUser(
    // Recibe el ID del usuario como argumento de la mutación.
    @Args('userId', { type: () => Int }) userId: number,
    // Recibe el ID del producto como argumento de la mutación.
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    // Invoca el método 'removeProductFromUser' del servicio 'productsService' para realizar la operación de desvinculación.
    return this.productsService.removeProductFromUser(userId, productId);
  }
}