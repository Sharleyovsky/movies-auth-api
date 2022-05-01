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
        status: HttpStatus.OK,
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
    async createMovie(
        @Request() req: UserRequest,
        @Body() { title }: CreateMovieDto,
    ) {
        const { id, role } = req.user;
        const hasExceededLimit = await this.moviesService.getLimitStatus(
            id,
            role,
        );

        if (hasExceededLimit) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.TOO_MANY_REQUESTS,
                    errorMessage:
                        "You have exceeded your monthly limit of API calls",
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return await this.moviesService.create({ title, id: req.user.id });
    }
}
