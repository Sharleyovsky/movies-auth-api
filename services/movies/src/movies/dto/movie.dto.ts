import { ApiProperty } from "@nestjs/swagger";

export class MovieDto {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    released: Date;

    @ApiProperty()
    genre: string;

    @ApiProperty()
    director: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
