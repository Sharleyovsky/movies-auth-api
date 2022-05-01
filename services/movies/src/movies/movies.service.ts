import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie, MovieDocument } from "./movie.schema";
import { OmdbService } from "../omdb/omdb.service";

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>,
        private readonly omdbService: OmdbService,
    ) {}

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
