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
import { UserRequest } from "../types/user";
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
        status: HttpStatus.OK,
        description: "Get all movies created by a authenticated user",
        isArray: true,
        type: MovieDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Calling API without authorization header",
        type: ErrorDto,
    })
    async getMovies(@Request() req: UserRequest) {
        return await this.moviesService.findUserMovies(req.user.id);
    }

    @UseGuards(JwtGuard)
    @Post()
    @ApiBearerAuth()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: "Create a movie based on title",
        isArray: false,
        type: MovieDto,
    })
    @ApiResponse({
        status: HttpStatus.TOO_MANY_REQUESTS,
        description:
            "User doesn't have premium role and has exceeded monthly limit",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: "Calling API without authorization header",
        type: ErrorDto,
    })
    async createMovie(
        @Request() req: UserRequest,
        @Body() { title }: CreateMovieDto,
    ) {
        const { id, role } = req.user;
        const hasExceededLimit = await this.moviesService.isAboveLimit(
            id,
            role,
        );

        if (hasExceededLimit) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    message:
                        "You have exceeded your monthly limit of API calls",
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return await this.moviesService.create({ title, id: req.user.id });
    }
}
