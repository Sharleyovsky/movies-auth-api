import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie, MovieDocument } from "./movie.schema";
import { OmdbService } from "../omdb/omdb.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>,
        private readonly omdbService: OmdbService,
        private readonly configService: ConfigService,
    ) {}

    async isAboveLimit(id: number, role: string) {
        if (role === "premium") {
            return false;
        }

        const toDate = new Date();
        const fromDate = new Date(
            toDate.getFullYear(),
            toDate.getMonth(),
            toDate.getDate() - 30,
        );
        const createdMoviesAmount = await this.movieModel.countDocuments({
            userId: id,
            createdAt: {
                $gte: fromDate.toISOString(),
                $lte: toDate.toISOString(),
            },
        });

        return createdMoviesAmount >= this.configService.get("apiCallsLimit");
    }

    async create({ title, userId }: { title: string; userId: number }) {
        const movie = await this.findUserMovie({ userId, title });

        if (movie) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "This movie was already added by this user!",
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const { Title, Released, Genre, Director } =
            await this.omdbService.getMovie(title);

        return new this.movieModel({
            userId,
            title: Title,
            released: Released,
            genre: Genre,
            director: Director,
        }).save();
    }

    async findUserMovies(userId: number) {
        return this.movieModel.find({ userId }).exec();
    }

    async findUserMovie(query: {
        userId: number;
        title?: string;
        _id?: string;
    }) {
        return this.movieModel.findOne(query);
    }
}
