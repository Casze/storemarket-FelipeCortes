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
      relations: {
        user: true,
      },
    });
  }
  async getProductsByUsername(name: string): Promise<Product[]> {
    const user = await this.userService.findOne(name);
    //console.log(user);
    if (!user) {
      //console.log('usuario no encontrado');
      return [];
    }
    const response = await this.productRepository.find({
      where: {
        username: name,
      },
    });
    const transformedProducts = response.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      username: product.username,
      user: user,
    }));
    console.log(transformedProducts);
    return transformedProducts;
  }

  async findOneProduct(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id,
      },
    });
  }
  async createProduct(product: CreateProductInput): Promise<Product> {
    const user = this.userService.findOne(product.username);
    if (user) {
      const newProduct = this.productRepository.create(product);
      return this.productRepository.save(newProduct);
    }
  }

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
          product.username = 'admin';
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
  async getUser(username: string): Promise<User> {
    return this.userService.findOne(username);
  }
  async getUserById(username: string): Promise<User> {
    return this.userService.findOne(username);
  }
  async updateProduct(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
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
    const user = await this.userService.findOneById(userId);  // Asegúrate de tener un método findOneById en tu userService
    if (!user) throw new NotFoundException('User not found');
  
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    product.user = user;
  
    return this.productRepository.save(product);
  }
  async removeProductFromUser(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
  
    product.user = null; // Desvinculamos el producto del usuario
  
    return this.productRepository.save(product);
  }  
  
}
