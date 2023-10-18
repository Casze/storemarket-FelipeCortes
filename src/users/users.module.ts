import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => ProductsModule)],
  providers: [...usersProviders, UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
