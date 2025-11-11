/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PPTDocument = PPT & Document;

@Schema({ timestamps: true })
export class PPT {
  id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slides: number;

  @Prop({ required: true })
  moduleId: string;

  @Prop({ required: false })
  moduleName?: string;

  @Prop({ type: String, required: true })
  fileUrl: string;

  @Prop({ type: String, required: false })
  fileName?: string;

  @Prop({ type: Number, required: false })
  fileSize?: number;

  @Prop({ type: String, required: false })
  mimeType?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const PPTSchema = SchemaFactory.createForClass(PPT);

PPTSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

PPTSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
