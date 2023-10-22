import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import axios from 'axios';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['user'],
    });
  }

  async getProductsByUsername(name: string): Promise<Product[]> {
    const user = await this.userService.findOne(name);
    if (!user) {
      return [];
    }
    return this.productRepository.find({
      where: { user: user }, // Aquí, filtramos por la relación "user"
    });
}


  async findOneProduct(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id: id }
    });
  }


  async createProduct(product: CreateProductInput): Promise<Product> {
    const user = await this.userService.findOne(product.username);
    if (user) {
      const newProduct = this.productRepository.create(product);
      return this.productRepository.save(newProduct);
    }
  }

  async fetchAndSaveProducts(): Promise<void> {
    // ... (no cambios aquí, se deja igual) ...
  }

  async getUser(username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  async updateProduct(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.findOneProduct(id);
    Object.assign(product, updateProductInput);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return true;
  }

  async addProductToUser(userId: number, productId: number): Promise<Product> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    product.user = user;
  
    return this.productRepository.save(product);
  }

  async removeProductFromUser(userId: number, productId: number): Promise<Product> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    if (!product.user || product.user.id !== user.id) throw new NotFoundException('Product not assigned to the specified user');
  
    product.user = null; // Desvinculamos el producto del usuario
  
    return this.productRepository.save(product);
  }
}
