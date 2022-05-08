import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { Model, model, Query } from "mongoose";
import { Movie, MovieDocument, MovieSchema } from "./movie.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { OmdbService } from "../omdb/omdb.service";
import { UserRequest } from "../types/user";
import { HttpException, HttpStatus } from "@nestjs/common";
import { MoviesError } from "./movies-error.enum";
import { ErrorDto } from "./dto/error.dto";

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

    describe("getMovie", () => {
        const _id = "123";
        const query = new Query<MovieDocument[], MovieDocument>();

        it("Should return a movie", async () => {
            const spyFindOne = jest
                .spyOn(mockedMovieModel, "findOne")
                .mockReturnValue(query);
            const spyExec = jest.spyOn(query, "exec").mockReturnValue(user);
            const movie = await controller.getMovie(requestMock, _id);

            expect(movie).toEqual(user);
            expect(spyFindOne).toBeCalledTimes(1);
            expect(spyExec).toBeCalledTimes(1);
        });

        it("Should throw an error when movie doesn't exist in the database", async () => {
            const spyFindOne = jest
                .spyOn(mockedMovieModel, "findOne")
                .mockReturnValue(query);
            const spyExec = jest.spyOn(query, "exec").mockReturnValue(null);

            try {
                await controller.getMovie(requestMock, _id);
                expect(spyFindOne).toBeCalledTimes(1);
                expect(spyExec).toBeCalledTimes(1);
            } catch (error) {
                const errRes: ErrorDto = error?.response;
                expect(error).toBeInstanceOf(HttpException);
                expect(errRes.statusCode).toBe(HttpStatus.NOT_FOUND);
                expect(errRes.message).toBe(MoviesError.NOT_FOUND);
            }
        });
    });
});
