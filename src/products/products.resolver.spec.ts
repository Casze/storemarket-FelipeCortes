import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { FetchAndSaveProductsResponse } from './dto/fetch-products';
//import { UpdateProductInput } from './dto/update-product.input';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsResolver,
        {
          provide: ProductsService,
          useValue: {
            products: jest.fn(),
            product: jest.fn(),
            productsByUser: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            fetchAndSaveProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ProductsResolver>(ProductsResolver);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('products', () => {
    it('should return an array of products', async () => {
      // Arrange
      const product1 = new Product();
      product1.name = 'Producto 1';
      product1.category = 'Electrónica';
      product1.price = 500;
      product1.description = 'Descripción del Producto 1';
      product1.image = 'imagen1.jpg';
      product1.username = 'usuario1';

      const product2 = new Product();
      product2.name = 'Producto 2';
      product2.category = 'Ropa';
      product2.price = 30;
      product2.description = 'Descripción del Producto 2';
      product2.image = 'imagen2.jpg';
      product2.username = 'usuario2';
      const expectedProducts: Product[] = [product1, product2];

      // Mock the productsService.products method
      productsService.findAll = jest.fn().mockResolvedValue(expectedProducts);

      // Act
      const result = await resolver.products();

      // Assert
      expect(result).toEqual(expectedProducts);
    });
  });
  describe('createProduct', () => {
    it('should create a product', async () => {
      // Arrange
      const productInput: CreateProductInput = {
        name: 'Producto 1',
        category: 'Electrónica',
        price: 500,
        image: 'imagen1.jpg',
        username: 'usuario1',
        description: 'Descripción del Producto 1',
      };

      const createdProduct: Product = {
        id: 1,
        name: 'Producto 1',
        category: 'Electrónica',
        price: 500,
        image: 'imagen1.jpg',
        username: 'usuario1',
        description: 'Descripción del Producto 1',
        user: {
          id: 1,
          name: 'usuario1',
          password: 'password',
          email: 'email',
          Products: [],
        },
      };

      // Mock the productsService.createProduct method
      productsService.createProduct = jest
        .fn()
        .mockResolvedValue(createdProduct);

      // Act
      const result = await resolver.createProduct(productInput);

      // Assert
      expect(result).toEqual(createdProduct);
    });
  });
  describe('fetchAndSaveProducts', () => {
    it('should fetch and save products', async () => {
      // Arrange
      const fetchAndSaveResponse: FetchAndSaveProductsResponse = {
        success: true,
        message: 'Productos obtenidos y guardados exitosamente.',
      };

      // Mock the productsService.fetchAndSaveProducts method
      productsService.fetchAndSaveProducts = jest
        .fn()
        .mockResolvedValue(fetchAndSaveResponse);

      // Act
      const result = await resolver.fetchAndSaveProducts();

      // Assert
      expect(result).toEqual(fetchAndSaveResponse);
    });
  });

  it('should update a product', async () => {
    // Arrange
    const mockUpdatedProduct = {
      id: 1,
      name: 'Updated Product',
      price: 200,
      category: 'Updated Category',
      description: 'Updated Description',
      image: 'Updated Image URL',
      username: 'Updated Username',
      user: {
        id: 1,
        name: 'Updated Username',
        password: 'password',
        email: 'email',
        Products: [],
      },
    };

    jest
      .spyOn(productsService, 'updateProduct')
      .mockImplementation(() => Promise.resolve(mockUpdatedProduct));

    // Act
    const result = await resolver.updateProduct(1, {
      name: 'Updated Product',
      price: 200,
      category: 'Updated Category',
      description: 'Updated Description',
      image: 'Updated Image URL',
      id: 1,
      username: 'Updated Username',
    });

    // Assert
    expect(result).toEqual(mockUpdatedProduct);
  });

  it('should delete a product', async () => {
    // Arrange
    const productId = 1;

    jest
      .spyOn(productsService, 'deleteProduct')
      .mockImplementation(() => Promise.resolve(true));

    // Act
    const result = await resolver.deleteProduct(productId);

    // Assert
    expect(result).toBe(true);
  });
});
