import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  category: string;

  @Column()
  @Field(() => Float)
  price: number;

  @Column('text')
  @Field()
  description: string;

  @Column('text')
  @Field()
  image: string;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => User, (user) => user.products, { nullable: true, eager: true })
  @JoinColumn({ name: "userId" })
  @Field(() => User, { nullable: true })
  user?: User;
}
