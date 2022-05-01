import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MovieDto {
    @ApiProperty()
    @IsString()
    title: string;
}
