import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  collection: 'users', // Especifica que use la colección 'users' existente
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: true })
  username?: string;

  @Prop()
  password?: string;

  @Prop({ type: [String], default: [] })
  favoriteMovieIds: string[];

  // Otros campos que puedas tener en users...
}

export const UserSchema = SchemaFactory.createForClass(User); 