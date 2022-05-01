import {
    Controller,
    Get,
    UseGuards,
    Request,
    Post,
    Body,
} from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { User } from "../types/User";
import { UserRequest } from "../types/UserRequest";
import { MoviesService } from "./movies.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { MovieDto } from "./dto/movie.dto";

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
        @Body() { title }: MovieDto,
    ) {
        return await this.moviesService.create({ title, id: req.user.id });
    }
}
