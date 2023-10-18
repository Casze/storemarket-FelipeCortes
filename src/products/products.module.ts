import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { productProvider } from './products.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  providers: [ProductsResolver, ProductsService, ...productProvider],
  exports: [ProductsService],
})
export class ProductsModule {}
