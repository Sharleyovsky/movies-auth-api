import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Movie {
    @Prop({ required: true })
    userId: number;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    released: Date;

    @Prop({ required: true })
    genre: string;

    @Prop({ required: true })
    director: string;
}

export type MovieDocument = Movie & Document;
export const MovieSchema = SchemaFactory.createForClass(Movie);
