import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ["products"] });
  }

  findOne(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: { name },
      relations: ["products"],
    });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ["products"] });
  }

  async getProduct(username: string): Promise<Product[]> {
    return this.productService.getProductsByUsername(username);
  }

  async register(createUserInput: CreateUserInput): Promise<User> {
    const saltOrRounds = 10;
    const user = new User();
    user.name = createUserInput.name;
    user.password = await bcrypt.hash(createUserInput.password, saltOrRounds);
    user.email = '';
    return this.userRepository.save(user);
  }

  async removeProductFromUser(userId: number, productId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['products'] });
    if (!user) return false;
  
    const productIndex = user.products.findIndex(product => product.id === productId);
    
    if (productIndex === -1) return false;
  
    user.products.splice(productIndex, 1);
    await this.userRepository.save(user);
  
    return true;
  }
}
