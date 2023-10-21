import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Module({
  providers: [
    ProductsService,
    {
      provide: getRepositoryToken(Product),
      useClass: Repository,
    },
  ],
})
export class ProductsTestModule {}
