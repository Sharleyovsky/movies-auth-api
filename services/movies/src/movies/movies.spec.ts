import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { Model, model, Query } from "mongoose";
import { Movie, MovieDocument, MovieSchema } from "./movie.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { OmdbService } from "../omdb/omdb.service";
import { UserRequest } from "../types/user";

describe("movies", () => {
    let controller: MoviesController;
    let service: MoviesService;
    let mockedMovieModel: Model<MovieDocument>;
    const user = {
        id: 1,
        role: "basic",
        name: "Jim",
    };
    const requestMock = {
        user,
    } as unknown as UserRequest;

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

    describe("getMovies", () => {
        it("Should return an array", async () => {
            const query = new Query<MovieDocument[], MovieDocument>();
            const spyFind = jest
                .spyOn(mockedMovieModel, "find")
                .mockReturnValue(query);
            const spyExec = jest.spyOn(query, "exec").mockReturnValue([]);
            const movies = await controller.getMovies(requestMock);

            expect(Array.isArray(movies)).toBe(true);
            expect(spyFind).toBeCalledTimes(1);
            expect(spyExec).toBeCalledTimes(1);
        });
    });
});
