import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { User } from "../types/User";
import { UserRequest } from "../types/UserRequest";
import { MoviesService } from "./movies.service";

@Controller("movies")
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @UseGuards(JwtGuard)
    @Get()
    async getMovies(@Request() req: UserRequest) {
        const { id }: User = req.user;
        return await this.moviesService.findAll(id);
    }
}
