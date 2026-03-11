import { prop, getModelForClass } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

class OrderItem {
  @prop({ required: true, type: () => String })
  public productId!: string;

  @prop({ required: true, type: () => String })
  public name!: string;

  @prop({ required: true, type: () => Number })
  public price!: number;

  @prop({ required: true, type: () => Number })
  public quantity!: number;
}

class Address {
  @prop({ type: () => String })
  public street?: string;

  @prop({ type: () => String })
  public city?: string;

  @prop({ type: () => String })
  public zip?: string;

  @prop({ type: () => String })
  public country?: string;
}

export class Order {
  @prop({ type: () => Schema.Types.ObjectId, ref: 'User' })
  public userId?: string;

  @prop({ type: () => [OrderItem], required: true })
  public items!: OrderItem[];

  @prop({ required: true, type: () => Number })
  public totalPrice!: number;

  @prop({ type: () => Address })
  public address?: Address;

  @prop({ required: true, default: 'pending', type: () => String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
  public status!: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @prop({ default: Date.now, type: () => Date })
  public createdAt!: Date;
}

export const OrderModel = getModelForClass(Order);
