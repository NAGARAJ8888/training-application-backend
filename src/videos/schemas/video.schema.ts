/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  id?: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  duration: string;

  @Prop({
    type: String,
    enum: ['module', 'basic'],
    required: true,
  })
  type: 'module' | 'basic';

  @Prop({ type: String, required: false })
  moduleId?: string;

  @Prop({ type: String, required: false })
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

export const VideoSchema = SchemaFactory.createForClass(Video);

VideoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

VideoSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toHexString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
