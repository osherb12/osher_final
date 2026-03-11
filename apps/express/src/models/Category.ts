import { prop, getModelForClass } from '@typegoose/typegoose';

export class Category {
  @prop({ required: true, unique: true, type: () => String })
  public name!: string;

  @prop({ default: Date.now, type: () => Date })
  public createdAt!: Date;
}

export const CategoryModel = getModelForClass(Category);
