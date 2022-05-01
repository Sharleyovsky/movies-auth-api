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
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MovieDto } from "./dto/movie.dto";
import { ErrorDto } from "./dto/error.dto";

@ApiTags("movies")
@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @UseGuards(JwtGuard)
    @Get()
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Get all movies created by a authenticated user",
        isArray: true,
        type: MovieDto,
    })
    async getMovies(@Request() req: UserRequest) {
        const { id }: User = req.user;
        return await this.moviesService.findAll(id);
    }

    @UseGuards(JwtGuard)
    @Post()
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Create a movie based on title",
        isArray: false,
        type: MovieDto,
    })
    @ApiResponse({
        status: 403,
        description:
            "User doesn't have premium role and has exceeded monthly limit",
        type: ErrorDto,
    })
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
