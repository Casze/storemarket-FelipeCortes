// Importamos las dependencias necesarias.
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/products/entities/product.entity';

// Decorador que marca la clase como un proveedor que puede ser inyectado.
@Injectable()
export class UsersService {
  
  // Constructor de la clase.
  // Inyectamos el repositorio de usuarios y el servicio de productos.
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => ProductsService))
    private productService: ProductsService,
  ) {}

  // Método para crear un nuevo usuario.
  create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  // Método que retorna todos los usuarios junto con sus productos relacionados.
  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ["products"] });
  }

  // Método que busca y retorna un usuario por su nombre junto con sus productos relacionados.
  findOne(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: { name },
      relations: ["products"],
    });
  }

  // Método que busca y retorna un usuario por su ID junto con sus productos relacionados.
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ["products"] });
  }

  // Método que retorna los productos asociados a un nombre de usuario.
  async getProduct(username: string): Promise<Product[]> {
    return this.productService.getProductsByUsername(username);
  }

  // Método para registrar un nuevo usuario, cifrando su contraseña antes de guardarla.
  async register(createUserInput: CreateUserInput): Promise<User> {
    const saltOrRounds = 10;
    const user = new User();
    user.name = createUserInput.name;
    user.password = await bcrypt.hash(createUserInput.password, saltOrRounds);
    user.email = '';
    return this.userRepository.save(user);
  }

  // Método para desvincular un producto de un usuario.
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