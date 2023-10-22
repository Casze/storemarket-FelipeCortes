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

  @Query(() => [Product])
  products() {
    return this.productsService.findAll();
  }

  @Query(() => Product)
  product(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOneProduct(id);
  }

  @Query(() => [Product])
  async productsByUser(@Args('name', { type: () => String }) name: string) {
    const response = await this.productsService.getProductsByUsername(name);
    return response;
  }

  @ResolveField(() => User)
  user(@Parent() product: Product): Promise<User> {
    return this.productsService.getUser(product.username);
  }

  @Mutation(() => Product)
  createProduct(@Args('productsInput') productsInput: CreateProductInput) {
    return this.productsService.createProduct(productsInput);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.updateProduct(id, updateProductInput);
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.deleteProduct(id);
  }

  @Mutation(() => FetchAndSaveProductsResponse)
  async fetchAndSaveProducts(): Promise<FetchAndSaveProductsResponse> {
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

  @Mutation(() => Product)
  async addProductToUser(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.addProductToUser(userId, productId);
  }

  @Mutation(() => Product)
  async removeProductFromUser(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<Product> {
    return this.productsService.removeProductFromUser(productId);
  }

}
