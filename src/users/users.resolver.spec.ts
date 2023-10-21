import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let usersService: UsersService;

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
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      // Arrange
      const createUserInput: CreateUserInput = {
        name: 'NewUser',
        password: 'Password123',
      };

      const createdUser: User = {
        id: 1,
        name: 'NewUser',
        password: 'Password123',
        email: 'newuser@example.com',
        Products: [],
      };

      // Mock the usersService.create method
      usersService.create = jest.fn().mockResolvedValue(createdUser);

      // Act
      const result = await resolver.createUser(createUserInput);

      // Assert
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
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

      // Mock the usersService.findAll method
      usersService.findAll = jest.fn().mockResolvedValue(expectedUsers);

      // Act
      const result = await resolver.findAll();

      // Assert
      expect(result).toEqual(expectedUsers);
    });
  });

  describe('findOne', () => {
    it('should find a user by name', async () => {
      // Arrange
      const name = 'User1';
      const user: User = {
        id: 1,
        name: 'User1',
        password: 'Password123',
        email: 'user1@example.com',
        Products: [],
      };

      // Mock the usersService.findOne method
      usersService.findOne = jest.fn().mockResolvedValue(user);

      // Act
      const result = await resolver.findOne(name);

      // Assert
      expect(result).toEqual(user);
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      // Arrange
      const createUserInput: CreateUserInput = {
        name: 'NewUser',
        password: 'Password123',
      };

      const registeredUser: User = {
        id: 1,
        name: 'NewUser',
        password: 'Password123',
        email: 'newuser@example.com',
        Products: [],
      };

      // Mock the usersService.register method
      usersService.register = jest.fn().mockResolvedValue(registeredUser);

      // Act
      const result = await resolver.register(createUserInput);

      // Assert
      expect(result).toEqual(registeredUser);
    });
  });
});
