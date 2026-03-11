import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';
import { Product } from './Product';
import { Schema } from 'mongoose';

export class Review {
  @prop({ required: true, ref: () => Product })
  public productId!: Ref<Product>;

  @prop({ required: true, ref: () => User })
  public userId!: Ref<User>;

  @prop({ required: true, type: () => Number, min: 1, max: 5 })
  public rating!: number;

  @prop({ required: true, type: () => String })
  public comment!: string;

  @prop({ default: Date.now, type: () => Date })
  public createdAt!: Date;
}

export const ReviewModel = getModelForClass(Review);
