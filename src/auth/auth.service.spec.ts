import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
//import { JwtModule } from '@nestjs/jwt';

const mockUserService = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};
describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: jwtConstants.secret, // Reemplaza con tu clave secreta
          signOptions: {
            expiresIn: '1h', // Opciones de firma del token
          },
        }),
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
        UsersModule,
        JwtModule,
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should validate user successfully', async () => {
    // Create a user
    const randomName = Math.random().toString(36).substring(7);
    const createUserInput: CreateUserInput = {
      name: randomName,
      password: 'password',
    };

    const user = await service.signup(createUserInput);

    // Validate the user
    const isAuthenticated = await service.validateUser(user.name, 'password');
    // Assert that the authenticatedUser is not null, indicating successful authentication
    expect(isAuthenticated).toBeDefined();
    // Assert that the user is authenticated
    expect(isAuthenticated.name).toBe(randomName); // Comprueba el nombre del usuario
    expect(isAuthenticated.email).toBe(''); // Comprueba el correo electrónico (puede variar según tu lógica)
    expect(isAuthenticated.id).toBeDefined(); // Comprueba que se haya asignado un ID al usuario
  });
  it('should return an access token and user information when the user exists', async () => {
    //generate a random name
    // Mock the user and payload
    const mockUser = {
      id: 1,
      name: 'John Doe',
      password: 'password',
      email: '',
      Products: [],
    };

    // Mock the JWT sign method to return a token
    mockJwtService.sign.mockReturnValue('mockAccessToken');

    // Mock the UserService findOne method to return the user
    mockUserService.findOne.mockReturnValue(mockUser);

    // Create a login input
    const loginInput = {
      name: 'John Doe',
      password: 'password',
    };

    // Call the login method
    const result = await service.login(loginInput);

    const jwtTokenPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

    // Assert that access_token is a non-null string with the expected format
    expect(result.access_token).not.toBeNull();
    expect(result.access_token).toMatch(jwtTokenPattern);
    expect(result.user.name).toEqual(mockUser.name); // Compara el objeto de usuario
  });
});
