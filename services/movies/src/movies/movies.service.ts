import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Movie, MovieDocument } from "./movie.schema";

@Injectable()
export class MoviesService {
    constructor(
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>,
    ) {}

    async findAll(id: number) {
        return this.movieModel.find({ userId: id }).exec();
    }
}
