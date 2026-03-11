import { prop, getModelForClass } from '@typegoose/typegoose';

class CartItem {
  @prop({ required: true, type: () => String })
  public productId!: string;

  @prop({ required: true, type: () => Number, default: 1 })
  public quantity!: number;
}

class Address {
  @prop({ type: () => String })
  public street?: string;

  @prop({ type: () => String })
  public city?: string;

  @prop({ type: () => String })
  public country?: string;

  @prop({ type: () => String })
  public zip?: string;
}

export class User {
  @prop({ required: true, unique: true, type: () => String })
  public email!: string;

  @prop({ required: true, type: () => String })
  public name!: string;

  @prop({ required: true, type: () => String })
  public password!: string;

  @prop({ required: true, default: 'user', type: () => String })
  public role!: 'admin' | 'user';

  @prop({ type: () => [CartItem], default: [] })
  public cart!: CartItem[];

  @prop({ type: () => [String], default: [] })
  public wishlist!: string[];

  // Profile Fields
  @prop({ type: () => String })
  public bio?: string;

  @prop({ type: () => String })
  public avatar?: string;

  @prop({ type: () => String })
  public phoneNumber?: string;

  @prop({ type: () => Address })
  public address?: Address;
}

export const UserModel = getModelForClass(User);
