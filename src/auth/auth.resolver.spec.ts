import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            signup: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return a LoginResponse', async () => {
      // Arrange
      const loginUserInput = {
        name: 'test',
        password: 'testpassword',
      };
      const expectedResult = {
        data: {
          login: {
            user: {
              name: 'felipe',
            },
            access_token: 'your_access_token_here',
          },
        },
      };

      // Mock the authService.login method
      authService.login = jest.fn().mockResolvedValue(expectedResult);

      // Act
      const result = await resolver.login(loginUserInput);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signup', () => {
    it('should return a User', async () => {
      // Arrange
      const loginUserInput = {
        name: 'testuser',
        password: 'testpassword',
      };
      // Define the expected user object here
      const expectedResult = {
        data: {
          signup: {
            name: 'Felipe3',
            id: 5,
          },
        },
      };

      // Mock the authService.signup method
      authService.signup = jest.fn().mockResolvedValue(expectedResult);

      // Act
      const result = await resolver.signup(loginUserInput);

      // Assert
      expect(result).toEqual(expectedResult);
    });
  });
});
