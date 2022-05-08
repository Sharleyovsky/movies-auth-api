import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { Model, model } from "mongoose";
import { Movie, MovieDocument, MovieSchema } from "./movie.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { OmdbService } from "../omdb/omdb.service";

describe("movies", () => {
    let controller: MoviesController;
    let service: MoviesService;
    let mockedMovieModel: Model<MovieDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                MoviesService,
                ConfigService,
                OmdbService,
                {
                    provide: getModelToken(Movie.name),
                    useValue: model(Movie.name, MovieSchema),
                },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        service = module.get<MoviesService>(MoviesService);
        mockedMovieModel = module.get<Model<MovieDocument>>(
            getModelToken(Movie.name),
        );
    });

    it("Should be defined", () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
        expect(mockedMovieModel).toBeDefined();
    });
});
