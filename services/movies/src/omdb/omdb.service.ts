import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { MoviesError } from "../movies/movies-error.enum";
import { OmdbMovie } from "../types/omdb-movie";

@Injectable()
export class OmdbService {
    private readonly url: string;
    constructor(private readonly configService: ConfigService) {
        this.url = configService.get("omdbUrl");
    }

    async getMovie(title: string) {
        try {
            const {
                data,
            }: {
                data: OmdbMovie;
            } = await axios.get(`${this.url}&t=${title}`);

            if (data?.Response !== "False") {
                if (data?.Released === "N/A") {
                    data.Released = new Date(0);
                }

                return data;
            }

            if (data?.Error === "Incorrect IMDb ID.") {
                //I'm handling it in the try part because this error for some reason is returned with 200 status code by OMDB api
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: MoviesError.API_TITLE,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (data?.Error === "Movie not found!") {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: MoviesError.API_NOT_FOUND,
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
        } catch (error) {
            if (error?.response.status === 401) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_GATEWAY,
                        message: MoviesError.INVALID_API_KEY,
                    },
                    HttpStatus.BAD_GATEWAY,
                );
            }

            if (error?.response && error?.status) {
                throw new HttpException(error.response, error.status);
            }

            throw new InternalServerErrorException();
        }
    }
}
