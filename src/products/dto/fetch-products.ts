import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class FetchAndSaveProductsResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
