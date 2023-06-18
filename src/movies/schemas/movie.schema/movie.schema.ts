import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: 0, min: 0, max: 10 })
  rating: number;

  @Prop({ required: false, default: 0 })
  ratingCount: number;

  @Prop()
  imageUrl: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);