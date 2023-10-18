import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

describe('ProductService', () => {
  let productService: ProductsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const product1 = new Product();
      product1.id = 1;
      product1.category = 'testCategory';
      product1.description = 'testDescription';
      product1.image = 'https://i.insider.com/5f835d4ebab422001979aaeb';
      product1.name = 'testProduct';
      product1.price = 100;
      product1.user = {
        id: 1,
        name: 'UserTestName',
        password: '',
        Products: [],
      };
      product1.username = product1.user.name;
      const product2 = new Product();
      product2.id = 2;
      product2.category = 'anotherTestCategory';
      product2.description = 'anotherTestDescription';
      product2.image =
        'https://assets.hongkiat.com/uploads/revolutionary-products/oculus-rift.jpg';
      product2.name = 'anotherTestProduct';
      product2.price = 200;

      product2.user = {
        id: 2,
        name: 'AnotherUserTestName',
        password: '',
        Products: [],
      };

      product2.username = product2.user.name;

      jest
        .spyOn(productRepository, 'find')
        .mockResolvedValue([product1, product2]);
      const result = await productService.findAll();
      expect(result).toEqual([product1, product2]);
    });
  });
});
