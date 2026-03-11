import { prop, getModelForClass } from '@typegoose/typegoose';

export class Contact {
  @prop({ required: true, type: () => String })
  public name!: string;

  @prop({ required: true, type: () => String })
  public email!: string;

  @prop({ required: true, type: () => String })
  public message!: string;

  @prop({ default: Date.now, type: () => Date })
  public createdAt!: Date;
}

export const ContactModel = getModelForClass(Contact);
