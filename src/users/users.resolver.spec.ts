import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ProductsService } from '../products/products.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Product } from '../products/entities/product.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            register: jest.fn(),
            removeProductFromUser: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            addProductToUser: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserInput: CreateUserInput = {
        name: 'NewUser',
        password: 'Password123',
      };
  
      const createdUser: User = {
        id: 1,
        name: 'NewUser',
        password: 'Password123',
        email: 'newuser@example.com',
        products: [],
      };

      usersService.create = jest.fn().mockResolvedValue(createdUser);

      const result = await resolver.createUser(createUserInput);
  
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const user1 = new User();
      user1.id = 1;
      user1.name = 'User1';
      user1.password = 'Password123';
      user1.email = 'user1@example.com';

      const user2 = new User();
      user2.id = 2;
      user2.name = 'User2';
      user2.password = 'Password456';
      user2.email = 'user2@example.com';

      const expectedUsers: User[] = [user1, user2];

      usersService.findAll = jest.fn().mockResolvedValue(expectedUsers);

      const result = await resolver.findAll();

      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should find a user by name', async () => {
      const name = 'User1';
      const user: User = {
        id: 1,
        name: 'User1',
        password: 'Password123',
        email: 'user1@example.com',
        products: [],
      };

      usersService.findOne = jest.fn().mockResolvedValue(user);

      const result = await resolver.findOne(name);

      expect(result).toEqual(user);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const createUserInput: CreateUserInput = {
        name: 'NewUser',
        password: 'Password123',
      };

      const registeredUser: User = {
        id: 1,
        name: 'NewUser',
        password: 'Password123',
        email: 'newuser@example.com',
        products: [],
      };

      usersService.register = jest.fn().mockResolvedValue(registeredUser);

      const result = await resolver.register(createUserInput);

      expect(result).toEqual(registeredUser);
    });
  });

  describe('removeProductFromUser', () => {
    it('should remove a product from a user', async () => {
      const userId = 1;
      const productId = 1;
      const expected = true;
  
      usersService.removeProductFromUser = jest.fn().mockResolvedValue(expected);
  
      const result = await resolver.removeProductFromUser(userId, productId);
  
      expect(result).toEqual(expected);
    });
  });
  
  describe('addProductToUser', () => {
    it('should add a product to a user', async () => {
      const userId = 1;
      const productId = 1;
      const product = new Product();
      product.id = 1;
      product.name = 'Product1';
      product.category = 'Category1';
      product.price = 100.0;
      product.description = 'Description1';
      product.image = 'image1.png';

      productsService.addProductToUser = jest.fn().mockResolvedValue(product);

      const result = await resolver.addProductToUser(userId, productId);
  
      expect(result).toEqual(product);
    });
  });
});
