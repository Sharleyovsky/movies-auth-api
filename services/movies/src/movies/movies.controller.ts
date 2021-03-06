import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    InternalServerErrorException,
    Param,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { UserRequest } from "../types/user";
import { MoviesService } from "./movies.service";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { MovieDto } from "./dto/movie.dto";
import { ErrorDto } from "./dto/error.dto";
import { UserRoles } from "../auth/user-roles.decorator";
import { UserRoleEnum } from "../auth/user-role.enum";
import { UserRolesGuard } from "../auth/guards/user-roles.guard";
import { MoviesError } from "./movies-error.enum";

@ApiTags("movies")
@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @UserRoles(UserRoleEnum.Basic, UserRoleEnum.Premium)
    @UseGuards(JwtGuard, UserRolesGuard)
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
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User's role is not allowed to access this endpoint",
        type: ErrorDto,
    })
    async getMovies(@Request() req: UserRequest) {
        return await this.moviesService.findUserMovies(req.user.id);
    }

    @UserRoles(UserRoleEnum.Basic, UserRoleEnum.Premium)
    @UseGuards(JwtGuard, UserRolesGuard)
    @Get(":id")
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
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Movie was not present in the database",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: "Movie ID was not type of ObjectId used in MongoDB",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User's role is not allowed to access this endpoint",
        type: ErrorDto,
    })
    async getMovie(@Request() req: UserRequest, @Param("id") _id: string) {
        try {
            const movie = await this.moviesService.findUserMovie({
                userId: req.user.id,
                _id,
            });

            if (!movie) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: MoviesError.NOT_FOUND,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return movie;
        } catch (error) {
            if (error?.kind === "ObjectId") {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: MoviesError.INVALID_ID,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (error?.response && error?.status) {
                throw new HttpException(error.response, error.status);
            }

            throw new InternalServerErrorException();
        }
    }

    @UserRoles(UserRoleEnum.Basic, UserRoleEnum.Premium)
    @UseGuards(JwtGuard, UserRolesGuard)
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
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description:
            "This could mean that title passed in body is either incorrect or empty or movie that you are looking for was already added by this user",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: "Movie was not found in the OMDB",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_GATEWAY,
        description: "You have used wrong API key for OMDB API",
        type: ErrorDto,
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: "User's role is not allowed to access this endpoint",
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
                    message: MoviesError.EXCEEDED_LIMIT,
                },
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        return await this.moviesService.create({
            title: title.trim(),
            userId: req.user.id,
        });
    }
}
