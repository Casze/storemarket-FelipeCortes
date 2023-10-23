// product.service.specs.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersService } from '../users/users.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepository: any;
  let mockUsersService: any;

  beforeEach(async () => {
    mockProductRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    mockUsersService = {
      findOne: jest.fn(),
      findOneById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
            provide: 'PRODUCT_REPOSITORY',
            useValue: mockProductRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Prueba para el método findAll:
  it('findAll should return an array of products', async () => {
    const testProducts: Product[] = [
      { id: 1, name: 'Test Product', category: 'Test', price: 100, description: 'Test Description', image: 'Test Image', userId: 1 }
    ];
      
    mockProductRepository.find.mockResolvedValue(testProducts);

    const products = await service.findAll();
    expect(products).toEqual(testProducts);
  });

});
