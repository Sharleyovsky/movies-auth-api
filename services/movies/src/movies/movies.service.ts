import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie, MovieDocument } from "./movie.schema";
import { OmdbService } from "../omdb/omdb.service";
import { User } from "../types/User";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>,
        private readonly omdbService: OmdbService,
        private readonly configService: ConfigService,
    ) {}

    async getLimitStatus({ id, role }: User) {
        if (role === "premium") {
            return false;
        }

        const toDate = new Date();
        const fromDate = new Date(toDate.getFullYear(), toDate.getMonth() + 1);
        const createdMoviesAmount = await this.movieModel.countDocuments({
            userId: id,
            createdAt: {
                $gte: fromDate.toString(),
                $lte: toDate.toString(),
            },
        });

        return createdMoviesAmount >= this.configService.get("apiCallsLimit");
    }

    async create({ title, id }: { title: string; id: number }) {
        const { Title, Released, Genre, Director } =
            await this.omdbService.getMovie(title);

        return new this.movieModel({
            userId: id,
            title: Title,
            released: Released,
            genre: Genre,
            director: Director,
        }).save();
    }

    async findAll(id: number) {
        return this.movieModel.find({ userId: id }).exec();
    }
}
