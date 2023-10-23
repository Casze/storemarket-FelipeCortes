import { Test, TestingModule } from '@nestjs/testing';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

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
            findAll: jest.fn(),
            findOneProduct: jest.fn(),
            createProduct: jest.fn(),
            deleteProduct: jest.fn(),
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

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products: Product[] = [{ id: 1, name: 'Test Product', category: 'Test', price: 100, description: 'Test Description', image: 'Test Image', userId: 1 }];
      (productsService.findAll as jest.Mock).mockResolvedValue(products);
      const result = await resolver.getAllProducts();
      expect(result).toEqual(products);
    });
  });

});
