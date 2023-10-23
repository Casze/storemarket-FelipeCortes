import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ProductsService } from '../products/products.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',  // Asegúrate de que este token coincida con lo que usas en tu servicio real
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            // ... otros métodos que uses en tu servicio
          },
        },
        {
          provide: ProductsService,
          useValue: {
            getProductsByUsername: jest.fn(),
            // any other methods used in your service
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
