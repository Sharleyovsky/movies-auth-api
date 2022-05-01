import {
    Controller,
    Get,
    UseGuards,
    Request,
    Post,
    Body,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { User } from "../types/User";
import { UserRequest } from "../types/UserRequest";
import { MoviesService } from "./movies.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMovieDto } from "./dto/create-movie.dto";

@ApiTags("movies")
@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @UseGuards(JwtGuard)
    @Get()
    @ApiResponse({
        status: 200,
        description: "Get all movies created by a authenticated user",
        isArray: true,
    })
    async getMovies(@Request() req: UserRequest) {
        const { id }: User = req.user;
        return await this.moviesService.findAll(id);
    }

    @UseGuards(JwtGuard)
    @Post()
    async createMovie(
        @Request() req: UserRequest,
        @Body() { title }: CreateMovieDto,
    ) {
        const hasCrossedLimit = await this.moviesService.getLimitStatus(
            req.user,
        );

        if (hasCrossedLimit) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.FORBIDDEN,
                    errorMessage:
                        "You have crossed your monthly limit of API calls",
                },
                HttpStatus.FORBIDDEN,
            );
        }

        return await this.moviesService.create({ title, id: req.user.id });
    }
}
