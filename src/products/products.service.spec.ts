import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AppModule } from '../app.module';
import { databaseProviders } from '../database/database.providers';

describe('ProductsService', () => {
  let service: ProductsService;
  let resolver: ProductsResolver;
  let productRepository: Repository<Product>;
  // Asegúrate de importar el modelo Product y Repository desde TypeORM
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '198252021298',
          database: 'test',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
      providers: [
        ...databaseProviders,
        AppModule,
        ProductsService,
        ProductsResolver,
        {
          provide: getRepositoryToken(ProductsService),
          useClass: ProductsService,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<ProductsService>(ProductsService);
    resolver = module.get<ProductsResolver>(ProductsResolver);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });
  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        {
          id: 1,
          name: 'Producto 1',
          category: 'Electrónica',
          price: 500,
          description: 'Descripción del Producto 1',
          image: 'imagen1.jpg',
          username: 'usuario1',
          user: {
            id: 1,
            name: 'usuario1',
            password: 'password',
            email: 'email',
            Products: [],
          },
        },
        {
          id: 2,
          name: 'Producto 2',
          category: 'Ropa',
          price: 30,
          description: 'Descripción del Producto 2',
          image: 'imagen2.jpg',
          username: 'usuario2',
          user: {
            id: 1,
            name: 'usuario1',
            password: 'password',
            email: 'email',
            Products: [],
          },
        },
      ];
      jest.spyOn(productRepository, 'find').mockResolvedValueOnce(products);
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(products));
      expect(await resolver.products()).toEqual(products);
    });
  });
});
