import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoviesController } from "./movies/movies.controller";
import { MoviesService } from "./movies/movies.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { getConfig } from "./config/config";
import { MoviesModule } from './movies/movies.module';

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
    ],
    controllers: [AppController, MoviesController],
    providers: [AppService, MoviesService],
})
export class AppModule {}
