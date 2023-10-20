import { Injectable, Inject } from '@nestjs/common';
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
    private productService: ProductsService,
  ) {}

  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        Products: true,
      },
    });
  }

  findOne(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        name,
      },
    });
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
}
