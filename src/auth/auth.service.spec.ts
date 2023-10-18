import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserInput } from '../users/dto/create-user.input';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
//import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<User>;

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
    const createUserInput: CreateUserInput = {
      name: 'John Doe',
      password: 'password',
    };

    const user = await service.signup(createUserInput);

    // Validate the user
    const isAuthenticated = await service.validateUser(user.name, 'password');

    // Assert that the user is authenticated
    expect(isAuthenticated).toBe(true);
  });
});
