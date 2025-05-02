import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema() export class User {

  @Prop({ require: true })
  username: string;

  @Prop()
   socketId: string;

}

export const userSchema = SchemaFactory.createForClass(User)

