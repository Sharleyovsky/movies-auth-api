import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class OmdbService {
    private readonly url: string;
    constructor(private readonly configService: ConfigService) {
        this.url = configService.get("omdbUrl");
    }

    async getMovie(title: string) {
        try {
            const { data } = await axios.get(`${this.url}&t=${title}`);

            if (data?.Response !== "False") {
                return data;
            }

            if (data?.Error === "Incorrect IMDb ID.") {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "Title is either empty or incorrect!",
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (data?.Error === "Movie not found!") {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message:
                            "Movie that you are looking for wasn't found in the OMDB",
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
        } catch (error) {
            if (error?.response.status === 401) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.BAD_GATEWAY,
                        message: "Server is using invalid API key!",
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
