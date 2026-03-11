import { prop, getModelForClass } from '@typegoose/typegoose';

export class Product {
  @prop({ required: true, type: () => String })
  public name!: string;

  @prop({ required: true, type: () => String })
  public description!: string;

  @prop({ required: true, type: () => Number })
  public price!: number;

  @prop({ required: true, type: () => String })
  public image!: string;

  @prop({ required: true, type: () => String })
  public category!: string;

  @prop({ required: true, default: 0, type: () => Number })
  public stock!: number;
}

export const ProductModel = getModelForClass(Product);
