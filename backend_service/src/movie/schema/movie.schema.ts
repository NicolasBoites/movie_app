import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  rank: number;

  @Prop({ required: true, trim: true })
  genre: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
