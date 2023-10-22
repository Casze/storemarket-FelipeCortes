import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field({ nullable: true })
  email: string;

  @OneToMany(() => Product, (product) => product.user)
  @Field(() => [Product])
  products: Product[];
}
