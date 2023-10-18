import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  name: string;

  @Field({ nullable: true })
  category: string;

  @IsNotEmpty()
  @Field(() => Float)
  price: number;

  @Field()
  image: string;

  @Field()
  username: string;

  @Field()
  description: string;
}
