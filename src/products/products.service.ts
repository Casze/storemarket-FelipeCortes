// Importamos las dependencias necesarias.
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

// Definiendo el servicio que manejará las operaciones de productos.
@Injectable()
export class ProductsService {
  // Inyectando el repositorio de productos y el servicio de usuarios.
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  // Inyectando el repositorio de productos y el servicio de usuarios.
  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['user'],
    });
  }

  // Inyectando el repositorio de productos y el servicio de usuarios.
  async getProductsByUsername(name: string): Promise<Product[]> {
    const user = await this.userService.findOne(name);
    if (!user) {
      return [];
    }
    return this.productRepository.find({
      where: { user: user }, 
    });
  }

  // Inyectando el repositorio de productos y el servicio de usuarios.
  async findOneProduct(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id: id }
    });
  }

  // Método para crear un nuevo producto.
  async createProduct(product: CreateProductInput): Promise<Product> {
    const user = await this.userService.findOne(product.username);
    if (user) {
      const newProduct = this.productRepository.create(product);
      return this.productRepository.save(newProduct);
    }
  }

  // Método para obtener y guardar productos desde una fuente externa
  async fetchAndSaveProducts(): Promise<void> {
    try {
      // Realiza una solicitud a la API pública para obtener los datos de productos
      const response = await axios.get(`https://fakestoreapi.com/products`);
      // Procesa los datos de respuesta según tu necesidad y mapea los datos a instancias de Product
      const productsData = response.data;
      console.log(productsData);
      // Verifica que la respuesta sea un array
      if (Array.isArray(productsData)) {
        const productsToSave = productsData.map((productData) => {
          const product = new Product();
          product.name = productData.title;
          product.price = Math.trunc(productData.price * 800);
          product.category = productData.category;
          //product.username = 'admin';
          product.description = productData.description;
          product.image = productData.image;
          // Mapea otras propiedades según tu entidad Product
          return product;
        });
        // Guarda los productos en la base de datos
        await this.productRepository.save(productsToSave);
      } else {
        // Maneja el caso en que la respuesta no sea un array
        throw new Error('La respuesta de la API no contiene productos válidos');
      }
    } catch (error) {
      // Maneja los errores apropiadamente (puede ser un error de red o de API)
      throw error;
    }
  }

  // Método para obtener un usuario por su nombre.
  async getUser(username: string): Promise<User> {
    return this.userService.findOne(username);
  }

  // Método para actualizar un producto existente.
  async updateProduct(id: number, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.findOneProduct(id);
    Object.assign(product, updateProductInput);
    return this.productRepository.save(product);
  }

  // Método para eliminar un producto.
  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return true;
  }

  // Métodos para asignar productos a usuarios.
  async addProductToUser(userId: number, productId: number): Promise<Product> {
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    product.user = user;
  
    return this.productRepository.save(product);
  }

  // Métodos para desasignar productos a usuarios.
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
