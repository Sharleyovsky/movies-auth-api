import { BadRequestException, Injectable } from "@nestjs/common";
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
            return data;
        } catch {
            throw new BadRequestException();
        }
    }
}
