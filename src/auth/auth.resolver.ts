import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { UseGuards } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user-input';
import { AuthGuard } from './gpl-auth.guard';
import { User } from '../users/entities/user.entity';
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(AuthGuard)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const result = await this.authService.login(loginUserInput);
    return result;
  }
  @Mutation(() => User)
  signup(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    return this.authService.signup(loginUserInput);
  }
}
