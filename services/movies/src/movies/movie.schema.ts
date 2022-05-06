import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Movie {
    @Prop({ required: true })
    userId: number;

    @Prop({ required: true, minlength: 1 })
    title: string;

    @Prop({ required: true })
    released: Date;

    @Prop({ required: true, minlength: 1 })
    genre: string;

    @Prop({ required: true, minlength: 1 })
    director: string;
}

export type MovieDocument = Movie & Document;
export const MovieSchema = SchemaFactory.createForClass(Movie);
