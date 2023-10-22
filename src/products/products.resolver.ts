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

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  getAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'product' })
  getProductById(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productsService.findOneProduct(id);
  }

  @Query(() => [Product], { name: 'productsByUser' })
  getProductsByUsername(@Args('name', { type: () => String }) name: string): Promise<Product[]> {
    return this.productsService.getProductsByUsername(name);
  }

  @ResolveField(() => User, { name: 'user' })
  getUserByProduct(@Parent() product: Product): Promise<User> {
    return this.productsService.getUser(product.user.name);
  }
  
  @Mutation(() => Product, { name: 'createProduct' })
  addNewProduct(@Args('productsInput') productsInput: CreateProductInput): Promise<Product> {
    return this.productsService.createProduct(productsInput);
  }

  @Mutation(() => Product, { name: 'updateProduct' })
  modifyProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => Boolean, { name: 'deleteProduct' })
  removeProduct(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.productsService.deleteProduct(id);
  }

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

  @Mutation(() => Product, { name: 'addProductToUser' })
  assignProductToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.addProductToUser(userId, productId);
  }

  @Mutation(() => Product, { name: 'removeProductFromUser' })
  unassignProductFromUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.removeProductFromUser(userId, productId);
  }
}
