import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { getConfig } from "./config/config";
import { MoviesModule } from "./movies/movies.module";
import { OmdbModule } from "./omdb/omdb.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [getConfig] }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get("connectionUri"),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        MoviesModule,
        OmdbModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
