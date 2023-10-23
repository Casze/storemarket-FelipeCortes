import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
//import { User } from 'src/users/entities/user.entity';
import { LoginUserInput } from './dto/login-user-input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private UserService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(name: string, password: string): Promise<any> {
    const user = await this.UserService.findOne(name);
    const valid = await bcrypt.compare(password, user?.password);
    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(loginUserInput: LoginUserInput) {
    // Valida al usuario y obtiene el usuario autenticado
    const user = await this.UserService.findOne(loginUserInput.name);

    if (!user) {
      // Manejo de error si el usuario no existe
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // construir el payload del token JWT
    const payload = {
      username: user.name, // Puedes incluir información del usuario
      sub: user.id, // Puedes incluir cualquier otra información necesaria
    };

    // Genera el token JWT utilizando el payload y una clave secreta
    const token = this.jwtService.sign(payload);

    // Devuelve el token y cualquier otra información que necesites
    // Devuelve el token y cualquier otra información que necesites
    return {
      access_token: token,
      user: user,
    };
  }
  async signup(loginUserInput: LoginUserInput) {
    const user = await this.UserService.findOne(loginUserInput.name);

    if (user) {
      throw new Error('El usuario ya existe');
    }
    return this.UserService.register({ ...loginUserInput });
  }
}
